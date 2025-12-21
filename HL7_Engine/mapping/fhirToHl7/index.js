// mapping/fhirToHl7/index.js

import { patientToAdt } from "./patientToAdt.js";
import { observationToOru } from "./observationToOru.js";

export function mapFHIRtoHL7(nmo) {
  const type = nmo.resourceType;

  if (type === "Patient") {
    return patientToAdt(nmo);
  }

  if (type === "Observation") {
    return observationToOru(nmo);
  }

  throw new Error(`No FHIR→HL7 mapping for resource type: ${type}`);
}
