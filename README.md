# rce.js

> A library for developers to easily create their own Rust Console Edition integrations such as discord bots using GPORTAL's API & WebSocket!

## Documentation

For a more in-depth documentation, refer to [GitBook](https://rcejs.gitbook.io/rcejs)! You can also join our support [discord server](https://discord.gg/npYygkeXSa)

## Installation

```bash
npm i b1nzeex/rce.js
```

## Example Usage - TypeScript

```typescript
import { RCEManager, LogLevel, RCEEvent } from "rce.js";

const rce = new RCEManager({
  email: "", // Your GPORTAL email address
  password: "", // Your GPORTAL password
  logLevel: LogLevel.Info, // Uses "Info" by default if left blank
  servers: [
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
  ], // An array of servers to listen to
});

await rce.init(); // This attempts to login to GPORTAL - this is required for everything else to function

rce.on(RCEEvent.PlayerKill, (data) => {
  console.log(
    `[${data.server.identifier}] ${data.killer.name} killed ${data.victim.name}`
  );

  // Send an in-game command to the Rust server by the unique identifier (kill-feed!)
  await rce.sendCommand(
    data.server.identifier,
    `say <color=red>${data.killer.name}</color> killed <color=red>${data.victim.name}</color>`
  );
});
```

## Example Usage - JavaScript (ES5)

```javascript
const { RCEManager, LogLevel, RCEEvent } = require("rce.js");

const rce = new RCEManager({
  email: "", // Your GPORTAL email address
  password: "", // Your GPORTAL password
  logLevel: LogLevel.Info, // Uses "Info" by default if left blank
  servers: [
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
  ], // An array of servers to listen to
});

await rce.init(); // This attempts to login to GPORTAL - this is required for everything else to function

rce.on(RCEEvent.PlayerKill, (data) => {
  console.log(
    `[${data.server.identifier}] ${data.killer.name} killed ${data.victim.name}`
  );

  // Send an in-game command to the Rust server by the unique identifier (kill-feed!)
  await rce.sendCommand(
    data.server.identifier,
    `say <color=red>${data.killer.name}</color> killed <color=red>${data.victim.name}</color>`
  );
});
```
