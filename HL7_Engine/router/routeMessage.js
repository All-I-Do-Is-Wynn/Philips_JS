// router/routeMessage.js
import { routingRules } from "./routingRules.js";
import { runPipeline } from "./runPipeline.js";
import { log } from "../logStream.js";
import { mapEngine } from "../mapping/mapEngine.js";
import { segmentsToHL7 } from "../mapping/hl7serialize.js";
import { sendHL7 } from "../senderClients/mllpSender.js";


export async function routeMessage(nmo, destination) {
  log(`Routing message: ${nmo.type || nmo.resourceType}`);
  //destination = destination.replace(/"/g, "").trim(); // Trims Quotes off of "cerner" and "epic"

  // Destination Logic
  if (destination === "cerner") {
    const rules = routingRules[nmo.protocol];
    if (!rules) {
      log(`No routing rules for protocol: ${nmo.protocol}`);
    return null;
    }
    for (const rule of rules) {
      if (rule.match(nmo)) {
      log(`Matched pipeline: ${rule.pipeline}`);
      const routed = await runPipeline(rule.pipeline, nmo);
      
      /* Send to Cerner Logic
      await sendHL7(routed, {
      host: "cerner.example.com",
      port: 2100
      });*/
      log("Sent below raw HL7 message to Cerner[IP:PORT] via MLLP");
      if (nmo.protocol === "HL7v2"){
        log(nmo.raw);
        return nmo.raw;
      }
      if (nmo.protocol === "FHIR"){
        const hl7 = await mapEngine("FHIR", "HL7v2", nmo);
        const output = segmentsToHL7(hl7);
        log(output);
        return output;

      }
      }
    }
  }
  if (destination === "epic") {
    // Send to Epic Logic
    const rules = routingRules[nmo.protocol];
    if (!rules) {
      log(`No routing rules for protocol: ${nmo.protocol}`);
    return null;
    }

    for (const rule of rules) {
      if (rule.match(nmo)) {
      log(`Matched pipeline: ${rule.pipeline}`);
      const routed = await runPipeline(rule.pipeline, nmo);
      log("Sent FHIR JSON message to Epic[HTTP_URL] via HTTP");
      if (nmo.protocol === "HL7v2"){
        log(JSON.stringify(routed,null,2));
        return routed;  // <-- CRITICAL
      }
      if (nmo.protocol === "FHIR"){
        
        log(JSON.stringify(nmo.raw,null,2));
        return nmo.raw;
      }
    }
    }
  }

  log("No matching destination found");
  return null;
}

