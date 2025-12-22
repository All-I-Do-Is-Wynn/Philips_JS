// pipelines/PatientPipeline/index.js
import { mapEngine } from "../../mapping/mapEngine.js";

export default async function (nmo) {
  if (nmo.protocol === "HL7v2") {
    return await mapEngine("HL7v2", "FHIR", nmo);
  }

  if (nmo.protocol === "FHIR") {
    return await mapEngine("FHIR", "HL7v2", nmo);
  }

  throw new Error(`Unsupported protocol in EncounterPipeline: ${nmo.protocol}`);
}
