// mapping/fhirToHl7/accountToBar.js
export function accountToBar(account) {
  const subjectRef = account.subject?.[0]?.reference || "";
  const patientId = subjectRef.split("/")?.[1] || "";

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
    "BAR^P01",
    "MSGID123",
    "P",
    "2.5"
  ];

  const pid = ["PID", "", "", patientId];

  const evn = [
    "EVN",
    "P01",
    new Date().toISOString()
  ];

  return [msh, pid, evn];
}
