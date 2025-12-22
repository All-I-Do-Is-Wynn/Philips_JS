// mapping/hl7ToFhir/vxuToImmunization.js
export function vxuToImmunization(nmo) {
  const pid = nmo.parsed.PID || [];
  const rxa = nmo.parsed.RXA || [];
  const rxe = nmo.parsed.RXE || [];

  const vaccine = rxa.length ? rxa : rxe;

  return {
    resourceType: "Immunization",
    status: "completed",
    vaccineCode: {
      coding: [
        {
          system: "http://hl7.org/fhir/sid/cvx",
          code: vaccine[5]?.split("^")[0] || "",
          display: vaccine[5]?.split("^")[1] || ""
        }
      ]
    },
    patient: {
      reference: `Patient/${pid[3] || "unknown"}`
    },
    occurrenceDateTime: vaccine[3] || null,
    lotNumber: vaccine[15] || undefined
  };
}
