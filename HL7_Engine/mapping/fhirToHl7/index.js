// mapping/fhirToHl7/index.js

import { patientToAdt } from "./patientToAdt.js";
import { observationToOru } from "./observationToOru.js";
import { encounterToSiu } from "./encounterToSiu.js";
import { immunizationToVxu } from "./immunizationToVxu.js";
import { documentReferenceToMdm } from "./documentReferenceToMdm.js";
import { claimToDft } from "./claimToDft.js";
import { serviceRequestToOrm } from "./serviceRequestToOrm.js";
import { medicationRequestToRde } from "./medicationRequestToRde.js";
import { medicationDispenseToRds } from "./medicationDispenseToRds.js";
import { accountToBar } from "./accountToBar.js";

export function mapFHIRtoHL7(nmo) {
  const res = nmo.parsed || {};
  const resourceType = res.resourceType;

  if (resourceType === "Patient") {
    return patientToAdt(res);
  }

  if (resourceType === "Observation") {
    return observationToOru(res);
  }

  if (resourceType === "Encounter") {
    return encounterToSiu(res);
  }

  if (resourceType === "Immunization") {
    return immunizationToVxu(res);
  }

  if (resourceType === "DocumentReference") {
    return documentReferenceToMdm(res);
  }

  if (resourceType === "Claim") {
    return claimToDft(res);
  }

  if (resourceType === "ServiceRequest") {
    return serviceRequestToOrm(res);
  }

  if (resourceType === "MedicationRequest") {
    return medicationRequestToRde(res);
  }

  if (resourceType === "MedicationDispense") {
    return medicationDispenseToRds(res);
  }

  if (resourceType === "Account") {
    return accountToBar(res);
  }

  throw new Error(`No FHIR→HL7 mapping for resourceType: ${resourceType}`);
}

