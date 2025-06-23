import { config } from "@elgato/eslint-config";

export default [
	...config.recommended,
	{
		ignores: [
			"node_modules",
			"com.bagl3y.yamaha-avr-controler.sdPlugin/bin",
			"com.bagl3y.yamaha-avr-controler.sdPlugin/log",
		],
	},
];
