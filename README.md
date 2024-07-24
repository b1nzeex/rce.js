# rce.js

> A library for developers to easily create their own Rust Console Edition integrations such as discord bots using GPORTAL's API & WebSocket!

## Installation

```bash
npm i b1nzeex/rce.js
```

## Example Usage - TypeScript

```typescript
import { RCEManager, LogLevel, RCEEvent } from "rce.js";

const rce = new RCEManager({
  refreshToken: "", // Obtained from g-portal.com Local Storage (Inspect Element)
  saveAuth: true, // Setting to "true" will save your G-PORTAL auth information to a JSON file so you don't have to enter credentials everytime you restart your application
  logLevel: LogLevel.INFO, // Uses "INFO" by default if left blank
});

await rce.init(); // This attempts to login to GPORTAL - this is required for everything else to function

const servers = [
  {
    identifier: "server1", // A unique name for your server to be recognised by
    region: "US", // It's either EU or US
    serverId: 1487554, // You can find this in the URL on your server page
    refreshPlayers: 2, // This will fetch the playerlist every 2 minutes, good for displaying player count
  },
  {
    identifier: "server2",
    region: "EU",
    serverId: 1487367,
  }, // As we didn't specify a "refreshPlayers" value, the playerlist won't be fetched
];

servers.forEach(async (server) => {
  // This will connect to all provided servers and start listening for events
  await rce.addServer(server);
});

rce.on(RCEEvent.PLAYER_KILL, (data) => {
  console.log(
    `[${data.server.identifier}] ${data.killer} killed ${data.victim}`
  );

  // Send an in-game command to the Rust server by the unique identifier (kill-feed!)
  await rce.sendCommand(
    data.server.identifier,
    `say <color=red>${data.killer}</color> killed <color=red>${data.victim}</color>`
  );
});
```

## Example Usage - JavaScript (ES5)

```javascript
const { RCEManager, LogLevel, RCEEvent } = require("rce.js");

const rce = new RCEManager({
  refreshToken: "", // Obtained from g-portal.com Local Storage (Inspect Element)
  saveAuth: true, // Setting to "true" will save your G-PORTAL auth information to a JSON file so you don't have to enter credentials everytime you restart your application
  logLevel: LogLevel.INFO, // Uses "INFO" by default if left blank
});

await rce.init(); // This attempts to login to GPORTAL - this is required for everything else to function

const servers = [
  {
    identifier: "server1", // A unique name for your server to be recognised by
    region: "US", // It's either EU or US
    serverId: 1487554, // You can find this in the URL on your server page
    refreshPlayers: 2, // This will fetch the playerlist every 2 minutes, good for displaying player count
  },
  {
    identifier: "server2",
    region: "EU",
    serverId: 1487367,
  }, // As we didn't specify a "refreshPlayers" value, the playerlist won't be fetched
];

servers.forEach(async (server) => {
  // This will connect to all provided servers and start listening for events
  await rce.addServer(server);
});

rce.on(RCEEvent.PLAYER_KILL, (data) => {
  console.log(
    `[${data.server.identifier}] ${data.killer} killed ${data.victim}`
  );

  // Send an in-game command to the Rust server by the unique identifier (kill-feed!)
  await rce.sendCommand(
    data.server.identifier,
    `say <color=red>${data.killer}</color> killed <color=red>${data.victim}</color>`
  );
});
```

## How To Obtain G-PORTAL Refresh Token

![GIF demonstrating how to obtain G-PORTAL refresh token](https://i.imgur.com/6jL2UgO.gif)

- **Step 1.** Navigate to [G-PORTAL Website](https://g-portal.com/en)
- **Step 2.** Login to G-PORTAL
- **Step 3.** In your browser, press `CTRL + SHIFT + I` all together to open the Developer Tools (inspect)
- **Step 4.** Navigate to the `Application` tab
- **Step 5.** Navigate to `Local Storage`
- **Step 6.** Select `gp-session`
- **Step 7.** Right click on the `refresh_token` and select `Copy Value`
- **Step 8.** You're done! Now paste the refresh token into your code
