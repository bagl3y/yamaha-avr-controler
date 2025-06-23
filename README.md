# Yamaha AVR Controller for Elgato Stream Deck

This plugin allows you to control the volume and mute status of your Yamaha AV Receiver using a dial on your Elgato Stream Deck+.

## Features

- **Volume Control**: Rotate the dial to increase or decrease the volume of your Yamaha AVR.
- **Mute Toggle**: Press the dial to toggle mute on and off. The plugin intelligently saves your volume before muting and restores it when you unmute.
- **Dynamic Display**: The dial's touchscreen displays the current volume in dB, a progress bar, and a dedicated icon for mute status.
- **Customizable Settings**: Configure the AVR's IP address, the volume step for each rotation tick, and the maximum volume level directly in the Stream Deck application.

## Installation

1.  Download the latest plugin package (`com.bagl3y.yamaha-avr-controler.sdPlugin`) from the [Releases page](https://github.com/bagl3y/yamaha-avr-controler/releases). (Note: This is a placeholder link).
2.  Double-click the downloaded file to install it in your Stream Deck application.

## Configuration

1.  In the Stream Deck app, drag the "Volume" action onto a dial slot.
2.  In the property inspector (the settings panel below the canvas), enter the following details:
    - **AVR IP Address**: The local IP address of your Yamaha receiver (e.g., `192.168.1.100`).
    - **Volume Step**: The number of dB to change the volume with each dial rotation "tick" (default is 1).
    - **Max Volume (dB)**: The maximum volume you want the dial to reach (default is 16.5 dB).

## Usage

- **Rotate the dial**: Adjusts the volume up or down.
- **Press the dial**: Toggles mute on or off.
- **Tap the touchscreen**: Refreshes the volume display from the AVR.

## Development

If you want to build the plugin from the source code, follow these steps:

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/yamaha-avr-controler.git
    cd yamaha-avr-controler
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Build the plugin:
    - For development (rebuilds on file changes and restarts the plugin in Stream Deck):
        ```bash
        npm run watch
        ```
    - For production (creates an optimized build in the `com.bagl3y.yamaha-avr-controler.sdPlugin` folder):
        ```bash
        npm run build
        ```
