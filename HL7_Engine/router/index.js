// router/index.js
import { normalizeHL7 } from "../normalizers/normalizehl7.js";
import { normalizefhir } from "../normalizers/normalizefhir.js";
import { routeMessage } from "./routeMessage.js";
import { log } from "../logStream.js";

export async function processInbound(raw, type) {
  try {
    log(`Processing inbound ${type} message`);

    const nmo = type === "HL7"
      ? normalizeHL7(raw)
      : normalizefhir(raw);

    log("--- Normalized Message Object ---");
    log(JSON.stringify(nmo, null, 2));

    const routed = await routeMessage(nmo);
    log("tmp");
    log("--- Routed Output ---");
    log(JSON.stringify(routed, null, 2));

    return routed;
  } catch (err) {
    log(`Inbound processing failed: ${err.message}`);
    return null;
  }
}
