import { WebSocketServer } from "ws";
import { logs, log } from "./logStream.js";
import { startMllp, stopMllp } from "./listeners/mllpManager.js";
import { startFhir, stopFhir } from "./listeners/fhirManager.js";
import { sendHL7, hl7Messages } from "./senderClients/mllpSender.js";
import { sendResource, fhirResources } from "./senderClients/fhirSender.js";
import { normalizeHL7 } from "./normalizers/normalizehl7.js";
import { normalizefhir } from "./normalizers/normalizefhir.js";
import { routeMessage } from "./router/routeMessage.js";
import { previewRoute } from "./mapping/previewRoute.js";


export function startWebSocket() {
  const wss = new WebSocketServer({ port: 8081 });

  wss.on("connection", (ws) => {
    log("Web UI connected");

    // Send existing logs immediately
    ws.send(JSON.stringify({ type: "logs", data: logs }));

    ws.on("message", async (msg) => {
      const data = JSON.parse(msg);

        switch (data.action) {
        case "start-mllp": startMllp(); break;
        case "stop-mllp": stopMllp(); break;
        case "start-fhir": startFhir(); break;
        case "stop-fhir": stopFhir(); break;
        case "send-hl7":
            sendHL7(hl7Messages[data.index]);
            break;
        case "send-fhir":
            sendResource(fhirResources[data.index]);
            break;
        case "preview-hl7":
            ws.send(JSON.stringify({
            type: "preview",
            data: hl7Messages[data.index]
            }));
            break;
        case "preview-fhir":
            ws.send(JSON.stringify({
            type: "preview",
            data: JSON.stringify(fhirResources[data.index], null, 2)
            }));
            break;
        case "preview-route-hl7": {
            const raw = hl7Messages[data.index];
            const nmo = normalizeHL7(raw);
            const routed = await previewRoute(nmo);

            ws.send(JSON.stringify({
            type: "preview",
            data: JSON.stringify(routed, null, 2)
            }));
            break;
        }
        case "run-route-hl7": {
            const raw = hl7Messages[data.index];
            const nmo = normalizeHL7(raw);
            const routed = await routeMessage(nmo);

            ws.send(JSON.stringify({
            type: "preview",
            data: JSON.stringify(routed, null, 2)
            }));
            break;
        }
        case "preview-route-fhir": {
            const raw = fhirResources[data.index];
            const nmo = normalizefhir(raw);
            const routed = await previewRoute(nmo);

            ws.send(JSON.stringify({
            type: "preview",
            data: JSON.stringify(routed, null, 2)
            }));
            break;
        }
        case "run-route-fhir": {
            const raw = fhirResources[data.index];
            const nmo = normalizefhir(raw);
            const routed = await routeMessage(nmo);

            ws.send(JSON.stringify({
            type: "preview",
            data: JSON.stringify(routed, null, 2)
            }));
            break;
        }
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
