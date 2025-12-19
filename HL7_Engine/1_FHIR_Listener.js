// FHIR Listener without using express library
import http from "http";

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/fhir") {
    let body = "";
    req.on("data", chunk => { body += chunk; });
    req.on("end", () => {
      try {
        const resource = JSON.parse(body);
        console.log("\n--- FHIR Resource Received ---");
        console.log("ResourceType:", resource.resourceType);
        console.log(JSON.stringify(resource, null, 2));

        res.writeHead(201, { "Content-Type": "application/fhir+json" });
        res.end(JSON.stringify({
          resourceType: "OperationOutcome",
          issue: [{ severity: "information", code: "informational", diagnostics: "Resource accepted successfully" }]
        }));
      } catch (err) {
        res.writeHead(400, { "Content-Type": "application/fhir+json" });
        res.end(JSON.stringify({
          resourceType: "OperationOutcome",
          issue: [{ severity: "error", code: "invalid", diagnostics: err.message }]
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
