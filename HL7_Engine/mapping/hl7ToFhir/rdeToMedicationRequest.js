// mapping/hl7ToFhir/rdeToMedicationRequest.js
export function rdeToMedicationRequest(nmo) {
  const pid = nmo.parsed.PID || [];
  const rxe = nmo.parsed.RXE || [];

  return {
    resourceType: "MedicationRequest",
    status: "active",
    intent: "order",
    subject: {
      reference: `Patient/${pid[3] || "unknown"}`
    },
    medicationCodeableConcept: {
      text: rxe[2]?.split("^")[1] || rxe[2] || ""
    },
    dosageInstruction: [
      {
        text: rxe[7] || ""
      }
    ]
  };
}
