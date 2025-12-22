// mapping/hl7ToFhir/barToAccount.js
export function barToAccount(nmo) {
  const pid = nmo.parsed.PID || [];
  const evn = nmo.parsed.EVN || [];

  return {
    resourceType: "Account",
    status: "active",
    name: `Account for patient ${pid[3] || "unknown"}`,
    subject: [
      {
        reference: `Patient/${pid[3] || "unknown"}`
      }
    ],
    coverage: [],
    meta: {
      tag: [
        {
          system: "http://example.org/source",
          code: "BAR"
        }
      ]
    },
    _hl7: {
      eventType: evn[1] || ""
    }
  };
}
