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
import { segmentsToHL7, extractHL7Segments } from "./mapping/hl7serialize.js";
import { create } from "xmlbuilder2";


// FOR FHIR Convert JSON → XML string
function toXml(resource) {
  const rootName = resource.resourceType;

  // Clone without resourceType
  const { resourceType, ...rest } = resource;

  const xmlObj = {
    [rootName]: {
      "@xmlns": "http://hl7.org/fhir",
      ...convertToFhirXml(rest)
    }
  };

  return create(xmlObj).end({ prettyPrint: true });
}

function convertToFhirXml(obj) {
  if (obj === null || obj === undefined) return null;

  // Primitive value → FHIR attribute
  if (typeof obj === "string" || typeof obj === "number" || typeof obj === "boolean") {
    return { "@value": obj };
  }

  // Arrays → list of elements
  if (Array.isArray(obj)) {
    return obj.map(item => convertToFhirXml(item));
  }

  // Objects → nested XML
  const result = {};
  for (const key of Object.keys(obj)) {
    result[key] = convertToFhirXml(obj[key]);
  }
  return result;
}


export function startWebSocket() {
  const wss = new WebSocketServer({ port: 8444 });

  wss.on("connection", (ws) => {
    log("Web UI connected");
    console.log("CLIENT CONNECTED");


    // Send existing logs immediately
    ws.send(JSON.stringify({ type: "logs", data: logs }));

    ws.on("message", async (msg) => {
      const data = JSON.parse(msg);
      
        switch (data.action) {
        case "start-mllp": startMllp(); break;
        case "stop-mllp": stopMllp(); break;
        case "start-fhir": startFhir(); break;
        case "stop-fhir": stopFhir(); break;

        // SENDERS
        case "send-hl7":
            sendHL7(hl7Messages[data.index]);
            break;
        case "send-fhir":
            sendResource(fhirResources[data.index], "json");
            break;
        case "send-xml-fhir":
            sendResource(fhirResources[data.index], "xml");
            break;

        // PREVIEW PANES
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
        case "preview-fhir-xml":
            const xml = toXml(fhirResources[data.index]);  // reuse your XML builder
            ws.send(JSON.stringify({
            type: "preview",
            data: xml
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

        // TO send outbound HL7 messages
        case "run-route-hl7": {
            const raw = hl7Messages[data.index];
            const nmo = normalizeHL7(raw);
        
            const routed = await routeMessage(nmo, JSON.stringify(data.destination));
            
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

            // Serialize fhir message from array format -> HL7 format
            const hl7String = Array.isArray(routed[0])
            ? segmentsToHL7(routed)
            : routed; // in case some mappings already return string
            
            ws.send(JSON.stringify({
            type: "preview",
            data: hl7String
            }));
            break;
        }
        case "run-route-fhir": {
            const raw = fhirResources[data.index];
            const nmo = normalizefhir(raw);
            const routed = await routeMessage(nmo);

            // routed is already the HL7 segment array
            const hl7String = segmentsToHL7(routed);

            log(hl7String); // ws send is not working properly, figure out later
            ws.send(JSON.stringify({
            type: "preview",
            data: hl7String
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

  log("WebSocket server started on ws://localhost:8444");
}
