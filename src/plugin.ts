import streamDeck, { LogLevel } from "@elgato/streamdeck";

import { VolumeController } from "./actions/volume-controller";

// We can enable "trace" logging so that all messages between the Stream Deck, and the plugin are recorded. When storing sensitive information
streamDeck.logger.setLevel(LogLevel.WARN);

// Register the volume controller action.
streamDeck.actions.registerAction(new VolumeController());

// Finally, connect to the Stream Deck.
streamDeck.connect();
