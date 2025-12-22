// mapping/fhirToHl7/medicationDispenseToRds.js
export function medicationDispenseToRds(md) {
  const patientId = md.subject?.reference?.split("/")?.[1] || "";

  const msh = [
    "MSH",
    "|",
    "^~\\&",
    "APP",
    "FAC",
    "RCVAPP",
    "RCVFAC",
    new Date().toISOString(),
    "",
    "RDS^O13",
    "MSGID123",
    "P",
    "2.5"
  ];

  const pid = ["PID", "", "", patientId];

  const quantity = md.quantity || {};
  const rds = [
    "RDS",
    "",
    "",
    quantity.value != null ? String(quantity.value) : "",
    quantity.unit || ""
  ];

  return [msh, pid, rds];
}
