// router/routeMessage.js
import { routingRules } from "./routingRules.js";
import { runPipeline } from "./runPipeline.js";
import { log } from "../logStream.js";
import { sendHL7 } from "../senderClients/mllpSender.js";


export async function routeMessage(nmo, destination) {
  log(`Routing message: ${nmo.type || nmo.resourceType}`);
  destination = destination.replace(/"/g, "").trim(); // Trims Quotes off of "cerner" and "epic"
  log("Destination = "+destination);

  // Destination Logic
  if (destination === "cerner") {
    /* Send to Cerner Logic
    await sendHL7(routed, {
      host: "cerner.example.com",
      port: 2100
    });*/
    log("Sent below raw HL7 message to Cerner[IP] via MLLP");
    log(nmo.raw);
    return nmo.raw;
  }
  if (destination === "epic") {
    /* Send to Epic Logic
    await sendResource(routed, "json"); // FHIR JSON*/
    const rules = routingRules[nmo.protocol];
    if (!rules) {
      log(`No routing rules for protocol: ${nmo.protocol}`);
    return null;
    }

    for (const rule of rules) {
      if (rule.match(nmo)) {
      log(`Matched pipeline: ${rule.pipeline}`);
      const routed = await runPipeline(rule.pipeline, nmo);
    log("Sent FHIR JSON message to Epic[IP] via HTTP");
      
      
        
      
        
    log(JSON.stringify(routed,null,2));
    return routed;  // <-- CRITICAL
    }
    }
  }

  log("No matching destination found");
  return null;
}

