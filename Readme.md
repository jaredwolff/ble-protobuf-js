# ble-protobuf-js

Example code for connecting to a `ble_protobuf` enabled Nordic Device. This app is currently set to use OSX only. See (untested) instructions below for other platforms.

## Setup

1. Clone this repo to a place on your computer
2. Make sure you have nvm installed
3. Run `nvm install v8.0.0`
4. Run `nvm install v10.15.3`
5. Run `nvm use v8.0.0`
6. Run `yarn` (if you don't have yarn `npm install yarn -g`)
7. Once installed, run `nvm use v10.15.3`
8. Then run `node index.js` to start the example

## Other platforms

1. `yarn install noble`
2. Replace `require('noble-mac');` in `index.js` with `require('noble');`
3. Then run `node index.js` to start the example