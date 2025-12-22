//// mapping/hl7ToFhir/index.js

import { adtToPatient } from "./adtToPatient.js";     // ADT -> Patient
import { oruToObservation } from "./oruToObservation.js";   // ORU -> Observation
import { siuToEncounter } from "./siuToEncounter.js";       // SIU -> Encounter
import { dftToClaim } from "./dftToClaim.js";               // DFT -> Claim
import { mdmToDocumentReference } from "./mdmToDocument.js"; // MDM -> DocumentReference
import { vxuToImmunization } from "./vxuToImmunization.js"; // VXU -> Immunization
import { ormToServiceRequest } from "./ormToServiceRequest.js"; // ORM -> ServiceRequest
import { rdeToMedicationRequest } from "./rdeToMedicationRequest.js"; // RDE -> MedicationRequest
import { rdsToMedicationDispense } from "./rdsToMedicationDispense.js"; // RDS -> MedicationDispense
import { barToAccount } from "./barToAccount.js";           // BAR -> Account

export function mapHL7toFHIR(nmo) {
  const type = nmo.type || "";
  const msg = nmo.parsed || {};

  // ADT → Patient
  if (type.startsWith("ADT")) {
    return adtToPatient(nmo);
  }

  // ORU → Observation
  if (type.startsWith("ORU")) {
    return oruToObservation(nmo);
  }

  // SIU → Encounter (Scheduling)
  if (type.startsWith("SIU")) {
    return siuToEncounter(nmo);
  }

  // DFT → Claim (Billing)
  if (type.startsWith("DFT")) {
    return dftToClaim(nmo);
  }

  // MDM → DocumentReference
  if (type.startsWith("MDM")) {
    return mdmToDocumentReference(nmo);
  }

  // VXU → Immunization
  if (type.startsWith("VXU")) {
    return vxuToImmunization(nmo);
  }

  // ORM → ServiceRequest
  if (type.startsWith("ORM")) {
    return ormToServiceRequest(nmo);
  }

  // RDE → MedicationRequest
  if (type.startsWith("RDE")) {
    return rdeToMedicationRequest(nmo);
  }

  // RDS → MedicationDispense
  if (type.startsWith("RDS")) {
    return rdsToMedicationDispense(nmo);
  }

  // BAR → Account
  if (type.startsWith("BAR")) {
    return barToAccount(nmo);
  }

  // Default fallback
  return {
    resourceType: "OperationOutcome",
    issue: [
      {
        severity: "error",
        code: "not-supported",
        diagnostics: `No HL7→FHIR mapping implemented for message type: ${type}`
      }
    ],
    _hl7: {
      type,
      raw: msg
    }

  };
}

