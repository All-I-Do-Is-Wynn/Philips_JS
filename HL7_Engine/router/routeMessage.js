// router/routeMessage.js
import { routingRules } from "./routingRules.js";
import { runPipeline } from "./runPipeline.js";
import { log } from "../logStream.js";

export async function routeMessage(nmo) {
  log(`Routing message: ${nmo.type || nmo.resourceType}`);

  const rules = routingRules[nmo.protocol];
  if (!rules) {
    log(`No routing rules for protocol: ${nmo.protocol}`);
    return null;
  }

  for (const rule of rules) {
    if (rule.match(nmo)) {
      log(`Matched pipeline: ${rule.pipeline}`);
      return await runPipeline(rule.pipeline, nmo);  // <-- CRITICAL
    }
  }

  log("No matching pipeline found");
  return null;
}

