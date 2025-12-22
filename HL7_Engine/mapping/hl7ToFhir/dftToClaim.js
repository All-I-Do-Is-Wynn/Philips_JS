// mapping/hl7ToFhir/dftToClaim.js
export function dftToClaim(nmo) {
  const pid = nmo.parsed.PID || [];
  const ft1 = nmo.parsed.FT1 || [];

  return {
    resourceType: "Claim",
    status: "active",
    type: {
      text: "professional"
    },
    patient: {
      reference: `Patient/${pid[3] || "unknown"}`
    },
    billablePeriod: {
      start: ft1[4] || null,
      end: ft1[5] || null
    },
    item: [
      {
        sequence: 1,
        productOrService: {
          text: ft1[7] || ""
        },
        unitPrice: {
          value: parseFloat(ft1[10]) || null,
          currency: "USD"
        }
      }
    ]
  };
}
