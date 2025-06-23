import {
	action,
	Action,
	DialDownEvent,
	DialRotateEvent,
	SingletonAction,
	TouchTapEvent,
	WillAppearEvent,
} from "@elgato/streamdeck";
import fetch from "node-fetch";

/**
 * Settings for {@link VolumeController}.
 */
type VolumeSettings = {
	/**
	 * The IP address of the Yamaha AVR.
	 */
	ip?: string;
	/**
	 * The step to change the volume by.
	 */
	step?: number;
	/**
	 * The maximum volume in dB.
	 */
	maxVolume?: number;
	/**
	 * The last volume before mute.
	 */
	lastVolume?: number;
};

/**
 * An action that controls the volume of a Yamaha AVR.
 */
@action({ UUID: "com.bagl3y.yamaha-avr-controler.volume" })
export class VolumeController extends SingletonAction<VolumeSettings> {
	/**
	 * The minimum volume in dB.
	 */
	private readonly MIN_DB = -80.5;

	/**
	 * Occurs when the user presses the dial.
	 * @param ev The event information.
	 * @returns A promise that resolves when the action is complete.
	 */
	public override async onDialDown(ev: DialDownEvent<VolumeSettings>): Promise<void> {
		const { ip } = ev.payload.settings;
		if (!ip) {
			await ev.action.showAlert();
			return;
		}

		try {
			const statusResponse = await fetch(`http://${ip}/YamahaExtendedControl/v1/main/getStatus`);
			if (!statusResponse.ok) {
				throw new Error(`Failed to get status: ${statusResponse.status}`);
			}
			const statusData = (await statusResponse.json()) as {
				/** When true, the device is muted. */
				mute: boolean;
				/** The current volume information. */
				actual_volume: {
					/** The volume level in dB. */
					value: number;
				};
			};

			if (statusData.mute) {
				await fetch(`http://${ip}/YamahaExtendedControl/v1/main/setMute?enable=false`);
				const settings = await ev.action.getSettings();
				if (settings.lastVolume !== undefined) {
					const volumeUrl = `http://${ip}/YamahaExtendedControl/v1/main/setVolume?volume=${settings.lastVolume}`;
					await fetch(volumeUrl);
				}
			} else {
				const settings = await ev.action.getSettings();
				settings.lastVolume = statusData.actual_volume.value;
				await ev.action.setSettings(settings);
				await fetch(`http://${ip}/YamahaExtendedControl/v1/main/setMute?enable=true`);
			}

			setTimeout(() => this.refreshVolume(ev.action), 200);
		} catch (error) {
			console.error("Failed to toggle mute:", error);
			await ev.action.showAlert();
		}
	}

	/**
	 * Occurs when the user rotates the dial.
	 * @param ev The event information.
	 * @returns A promise that resolves when the action is complete.
	 */
	public override async onDialRotate(ev: DialRotateEvent<VolumeSettings>): Promise<void> {
		const { ip, step } = ev.payload.settings;
		if (!ip) {
			await ev.action.showAlert();
			return;
		}

		const direction = ev.payload.ticks > 0 ? "up" : "down";
		const volumeStep = Math.abs(ev.payload.ticks) * (step ?? 1);

		try {
			const url = `http://${ip}/YamahaExtendedControl/v1/main/setVolume?volume=${direction}&step=${volumeStep}`;
			await fetch(url);
			setTimeout(() => this.refreshVolume(ev.action), 200);
		} catch (error) {
			console.error("Failed to set volume:", error);
			await ev.action.showAlert();
		}
	}

	/**
	 * Occurs when the user taps the touchscreen.
	 * @param ev The event information.
	 * @returns A promise that resolves when the action is complete.
	 */
	public override onTouchTap(ev: TouchTapEvent<VolumeSettings>): Promise<void> {
		return this.refreshVolume(ev.action);
	}

	/**
	 * Occurs when the action appears on the Stream Deck.
	 * @param ev The event information.
	 * @returns A promise that resolves when the action is complete.
	 */
	public override onWillAppear(ev: WillAppearEvent<VolumeSettings>): Promise<void> {
		return this.refreshVolume(ev.action);
	}

	/**
	 * Converts dB volume to a percentage for the Stream Deck display.
	 * @param db The volume in dB.
	 * @param maxDb The maximum volume in dB.
	 * @returns The volume as a percentage.
	 */
	private dbToPercentage(db: number, maxDb: number): number {
		const percentage = (100 * (db - this.MIN_DB)) / (maxDb - this.MIN_DB);
		return Math.max(0, Math.min(100, percentage));
	}

	/**
	 * Fetches the current volume from the AVR and updates the display.
	 * @param action The action object.
	 * @returns A promise that resolves when the display is updated.
	 */
	private async refreshVolume(action: Action<VolumeSettings>): Promise<void> {
		const settings = await action.getSettings();
		const { ip, maxVolume } = settings;
		if (!ip) {
			await action.showAlert();
			return;
		}

		if (!action.isDial()) {
			return;
		}

		try {
			const response = await fetch(`http://${ip}/YamahaExtendedControl/v1/main/getStatus`);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = (await response.json()) as {
				/** The current volume information. */
				actual_volume: {
					/** The volume level in dB. */
					value: number;
				};
				/** When true, the device is muted. */
				mute: boolean;
			};
			const currentDb = data.actual_volume.value;
			const isMuted = data.mute || currentDb <= this.MIN_DB;

			await action.setFeedback({
				title: "Volume",
				value: isMuted ? "Muted" : `${currentDb.toFixed(1)} dB`,
				indicator: isMuted ? 0 : this.dbToPercentage(currentDb, maxVolume ?? 16.5),
				icon: isMuted ? "imgs/actions/volume/icon-mute.svg" : "imgs/actions/volume/icon.svg",
			});
		} catch (error) {
			console.error("Failed to fetch volume:", error);
			await action.showAlert();
		}
	}
}
