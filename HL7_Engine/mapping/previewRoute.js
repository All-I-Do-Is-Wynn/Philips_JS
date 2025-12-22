import { mapEngine } from "./mapEngine.js";

export async function previewRoute(nmo) {
  if (nmo.protocol === "HL7v2") {
    return await mapEngine("HL7v2", "FHIR", nmo);
  }

  if (nmo.protocol === "FHIR") {
    return await mapEngine("FHIR", "HL7v2", nmo);
  }

  return null;
}
