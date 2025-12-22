// mapping/fhirToHl7/medicationRequestToRde.js
export function medicationRequestToRde(mr) {
  const patientId = mr.subject?.reference?.split("/")?.[1] || "";

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
    "RDE^O11",
    "MSGID123",
    "P",
    "2.5"
  ];

  const pid = ["PID", "", "", patientId];

  const rxe = [
    "RXE",
    "",
    mr.medicationCodeableConcept?.text || "",
    "",
    "",
    "",
    "",
    mr.dosageInstruction?.[0]?.text || ""
  ];

  return [msh, pid, rxe];
}
