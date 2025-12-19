// fhirListener.js
import express from "express";

const app = express();
app.use(express.json()); // parse JSON bodies

// Generic endpoint to accept FHIR resources
app.post("/fhir", (req, res) => {
  try {
    const resource = req.body;

    if (!resource || !resource.resourceType) {
        throw new Error("Invalid FHIR resource: missing resourceType");
    }
  

    console.log("\n--- FHIR Resource Received ---");
    console.log("ResourceType:", resource.resourceType);
    console.log(JSON.stringify(resource, null, 2));

    // TODO: validate resource, route to downstream systems, persist, etc.

    // Respond with a FHIR OperationOutcome (success)
    res.status(201).json({
      resourceType: "OperationOutcome",
      issue: [
        {
          severity: "information",
          code: "informational",
          diagnostics: "Resource accepted successfully"
        }
      ]
    });
  } catch (err) {
    console.error("Error handling FHIR resource:", err.message);
    res.status(400).json({
      resourceType: "OperationOutcome",
      issue: [
        {
          severity: "error",
          code: "invalid",
          diagnostics: err.message
        }
      ]
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`FHIR listener running on http://localhost:${PORT}/fhir`);
});
