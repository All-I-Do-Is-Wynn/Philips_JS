// pipelines/PatientPipeline/index.js
import { mapEngine } from "../../mapping/mapEngine.js";

export default async function(nmo) {
  return await mapEngine("HL7v2", "FHIR", nmo);
}
