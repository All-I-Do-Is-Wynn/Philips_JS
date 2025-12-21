import { WebSocketServer } from "ws";
import { logs, log } from "./logStream.js";
import { startMllp, stopMllp } from "./listeners/mllpManager.js";
import { startFhir, stopFhir } from "./listeners/fhirManager.js";
import { sendHL7, hl7Messages } from "./senderClients/mllpSender.js";
import { sendResource, fhirResources } from "./senderClients/fhirSender.js";

export function startWebSocket() {
  const wss = new WebSocketServer({ port: 8081 });

  wss.on("connection", (ws) => {
    log("Web UI connected");

    // Send existing logs immediately
    ws.send(JSON.stringify({ type: "logs", data: logs }));

    ws.on("message", (msg) => {
      const { action } = JSON.parse(msg);

      switch (action) {
        case "start-mllp": startMllp(); break;
        case "stop-mllp": stopMllp(); break;
        case "start-fhir": startFhir(); break;
        case "stop-fhir": stopFhir(); break;
        case "send-hl7": sendHL7(hl7Messages[msg.index || 1]); break;
        case "send-fhir": sendResource(fhirResources[1]); break;
      }
    });
  });

  // Broadcast logs to all clients
  setInterval(() => {
    const payload = JSON.stringify({ type: "logs", data: logs });
    wss.clients.forEach((client) => client.send(payload));
  }, 500);

  log("WebSocket server started on ws://localhost:8081");
}
