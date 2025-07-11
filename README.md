# rce.js

> A library for developers to easily create their own Rust Console Edition integrations such as discord bots using RCON!

## Documentation

For a more in-depth documentation, refer to [GitBook](https://rcejs.gitbook.io/rcejs)! You can also join our support [discord server](https://discord.gg/npYygkeXSa)

## Installation

```bash
npm i b1nzeex/rce.js
```

## Example Usage - TypeScript

```typescript
import RCEManager, { LogLevel, RCEEvent } from "rce.js";

const rce = new RCEManager({
  logLevel: LogLevel.Debug,
});

await rce.addServer([
  {
    identifier: "server1", // A Unique Name For your Server To Be Recognised By
    rcon: {
      host: "", // IP address of server
      port: 0, // RCON port of server
      password: "", // RCON password of server
    },
    state: [], // Any information you wish to pass to the server
  },
]);

rce.on(RCEEvent.PlayerKill, (data) => {
  console.log(
    `[${data.server.identifier}] ${data.killer.name} killed ${data.victim.name}`
  );

  // Send an in-game command to the Rust server by the unique identifier (kill-feed!)
  rce.sendCommand(
    data.server.identifier,
    `say <color=red>${data.killer.name}</color> killed <color=red>${data.victim.name}</color>`
  );
});

// Optional Methods
await rce.addServer(SERVER_INFO); // Add A Single Server
rce.removeServer("identifier"); // Remove A Server
rce.getServer("identifier"); // Get Server
await rce.fetchInfo("identifier"); // Get "serverinfo" Command Details
await rce.sendCommand("identifier", "say Hello World"); // Send Command
rce.destroy(); // Gracefully Close RCE.JS
```
