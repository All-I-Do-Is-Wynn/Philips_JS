// mapping/fhirToHl7/serviceRequestToOrm.js
export function serviceRequestToOrm(sr) {
  const patientId = sr.subject?.reference?.split("/")?.[1] || "";

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
    "ORM^O01",
    "MSGID123",
    "P",
    "2.5"
  ];

  const pid = ["PID", "", "", patientId];

  const orc = [
    "ORC",
    "NW",
    "",
    "",
    "",
    "",
    "",
    "",
    sr.authoredOn || ""
  ];

  const obr = [
    "OBR",
    "1",
    "",
    "",
    `${sr.code?.coding?.[0]?.code || ""}^${sr.code?.coding?.[0]?.display || ""}`,
    "",
    ""
  ];

  return [msh, pid, orc, obr];
}
