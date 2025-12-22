// mapping/fhirToHl7/immunizationToVxu.js
export function immunizationToVxu(imm) {
  const patientId = imm.patient?.reference?.split("/")?.[1] || "";

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
    "VXU^V04",
    "MSGID123",
    "P",
    "2.5"
  ];

  const pid = ["PID", "", "", patientId];

  const rxa = [
    "RXA",
    "0",
    "1",
    imm.occurrenceDateTime || "",
    "",
    `${imm.vaccineCode?.coding?.[0]?.code || ""}^${imm.vaccineCode?.coding?.[0]?.display || ""}`,
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    imm.lotNumber || ""
  ];

  return [msh, pid, rxa];
}
