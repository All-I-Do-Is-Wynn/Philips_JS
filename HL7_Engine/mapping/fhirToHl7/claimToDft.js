// mapping/fhirToHl7/claimToDft.js
export function claimToDft(claim) {
  const patientId = claim.patient?.reference?.split("/")?.[1] || "";

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
    "DFT^P03",
    "MSGID123",
    "P",
    "2.5"
  ];

  const pid = ["PID", "", "", patientId];

  const item = claim.item?.[0] || {};
  const ft1 = [
    "FT1",
    "1",
    "",
    "",
    claim.billablePeriod?.start || "",
    claim.billablePeriod?.end || "",
    "",
    item.productOrService?.text || "",
    "",
    "",
    item.unitPrice?.value != null ? String(item.unitPrice.value) : "",
    "",
    ""
  ];

  return [msh, pid, ft1];
}
