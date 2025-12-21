// mapping/hl7ToFhir/index.js

import { adtToPatient } from "./adtToPatient.js";
import { oruToObservation } from "./oruToObservation.js";

export function mapHL7toFHIR(nmo) {
  const type = nmo.type;

  if (type.startsWith("ADT")) {
    return adtToPatient(nmo);
  }

  if (type.startsWith("ORU")) {
    return oruToObservation(nmo);
  }

  throw new Error(`No HL7→FHIR mapping for message type: ${type}`);
}
