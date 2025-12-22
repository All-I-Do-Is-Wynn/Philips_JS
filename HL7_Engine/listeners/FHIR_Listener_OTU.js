// FHIR Listener without using express library
// Research Express library implementation
import http from "http";
import { normalizefhir } from "../normalizers/normalizefhir.js";
import { routeMessage } from "../router/routeMessage_OTU.js";

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/fhir") {
    let body = "";

    req.on("data", chunk => { body += chunk; });

    req.on("end", () => {
      try {
        const resource = JSON.parse(body);

        console.log("\n--- Raw FHIR Resource Received ---");
        console.log(JSON.stringify(resource, null, 2));

        // 🔥 Normalize the FHIR resource
        const nmo = normalizefhir(resource);

        console.log("\n--- Normalized FHIR Message Object ---");
        console.log(JSON.stringify(nmo, null, 2));

        // 🔀 Send to routing layer (optional)
        routeMessage(nmo);

        // Respond with OperationOutcome
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

server.listen(3000, () => {
  console.log("FHIR listener running on http://localhost:3000/fhir");
});
