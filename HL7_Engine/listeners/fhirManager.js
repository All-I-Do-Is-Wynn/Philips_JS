import http from "http";
import { normalizefhir } from "../normalizers/normalizefhir.js";
import { routeMessage } from "../router/routeMessage.js";
import { log } from "../logStream.js";

let fhirServer = null;

export function startFhir(port = 3000) {
  if (fhirServer) {
    log("FHIR listener already running");
    return;
  }

  fhirServer = http.createServer((req, res) => {
    log(`FHIR request received: ${req.method} ${req.url}`);
    if (req.method === "POST" && req.url === "/fhir") {
      let body = "";

      req.on("data", chunk => { body += chunk; });

      req.on("end", () => {
        try {
            log(`FHIR raw body: "${body}"`);

          const resource = JSON.parse(body);

          log("--- Raw FHIR Resource Received ---");
          log(JSON.stringify(resource, null, 2));

          // Normalize
          const nmo = normalizefhir(resource);

          log("--- Normalized FHIR Message Object ---");
          log(JSON.stringify(nmo, null, 2));

          // Route
          routeMessage(nmo);

          // Respond
          res.writeHead(201, { "Content-Type": "application/fhir+json" });
          res.end(JSON.stringify({
            resourceType: "OperationOutcome",
            issue: [{
              severity: "information",
              code: "informational",
              diagnostics: "Resource accepted and normalized"
            }]
          }));

        } catch (err) {
            log(`FHIR parse error: ${err.message}`);
          res.writeHead(400, { "Content-Type": "application/fhir+json" });
          res.end(JSON.stringify({
            resourceType: "OperationOutcome",
            issue: [{
              severity: "error",
              code: "invalid",
              diagnostics: err.message
            }]
          }));
        }
      });

    } else {
      res.writeHead(404);
      res.end();
    }
  });

  fhirServer.listen(port, () => {
    log(`FHIR listener started on http://localhost:${port}/fhir`);
  });
}

export function stopFhir() {
  if (!fhirServer) {
    log("FHIR listener is not running");
    return;
  }

  fhirServer.close(() => {
    log("FHIR listener stopped");
    fhirServer = null;
  });
}
