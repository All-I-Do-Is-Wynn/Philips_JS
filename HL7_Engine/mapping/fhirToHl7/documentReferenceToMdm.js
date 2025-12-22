// mapping/fhirToHl7/documentReferenceToMdm.js
export function documentReferenceToMdm(doc) {
  const patientId = doc.subject?.reference?.split("/")?.[1] || "";

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
    "MDM^T02",
    "MSGID123",
    "P",
    "2.5"
  ];

  const pid = ["PID", "", "", patientId];

  const txa = [
    "TXA",
    "",
    doc.type?.text || "",
    "",
    "",
    "",
    doc.date || "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    doc.description || ""
  ];

  return [msh, pid, txa];
}
