import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const packageJsonPath = resolve(process.cwd(), "package.json");
const manifestJsonPath = resolve(process.cwd(), "com.bagl3y.yamaha-avr-controler.sdPlugin/manifest.json");

try {
	// Read files
	const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
	const manifestJson = JSON.parse(readFileSync(manifestJsonPath, "utf-8"));

	const newVersion = packageJson.version;
	if (!newVersion) {
		throw new Error("Version not found in package.json");
	}

	console.log(`Syncing version to ${newVersion}...`);

	// Update manifest version
	manifestJson.Version = newVersion;

	// Write updated manifest
	writeFileSync(manifestJsonPath, JSON.stringify(manifestJson, null, "\t"));

	console.log("manifest.json has been updated successfully.");
} catch (error) {
	console.error("Failed to sync version:", error);
	process.exit(1);
}
