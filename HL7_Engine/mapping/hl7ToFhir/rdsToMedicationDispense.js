// mapping/hl7ToFhir/rdsToMedicationDispense.js
export function rdsToMedicationDispense(nmo) {
  const pid = nmo.parsed.PID || [];
  const rds = nmo.parsed.RDS || [];

  return {
    resourceType: "MedicationDispense",
    status: "completed",
    subject: {
      reference: `Patient/${pid[3] || "unknown"}`
    },
    quantity: {
      value: parseFloat(rds[3]) || null,
      unit: rds[4] || ""
    }
  };
}
