module.exports = {
	root: true,
	parser: "@typescript-eslint/parser",
	plugins: [
		"@typescript-eslint",
		"jsdoc",
	],
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:jsdoc/recommended",
	],
	ignorePatterns: ["node_modules/", "com.bagl3y.yamaha-avr-controler.sdPlugin/bin/"],
	rules: {
		// You can add custom rules here if needed
	},
};
