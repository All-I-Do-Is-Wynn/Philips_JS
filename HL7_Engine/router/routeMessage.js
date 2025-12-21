/// router/routeMessage.js
import { routingRules } from "./routingRules.js";
import { runPipeline } from "./runPipeline.js";

export function routeMessage(nmo) {
  console.log("\n--- Routing Message ---");
  console.log("Protocol:", nmo.protocol);
  console.log("Type:", nmo.type || nmo.resourceType);
  console.log("Patient ID:", nmo.patientId);

  const rules = routingRules[nmo.protocol];

  if (!rules) {
    console.error("No routing rules for protocol:", nmo.protocol);
    return;
  }

  for (const rule of rules) {
    if (rule.match(nmo)) {
      console.log("Matched pipeline:", rule.pipeline);
      runPipeline(rule.pipeline, nmo);
      return;
    }
  }

  console.warn("No matching pipeline found for message.");
}
