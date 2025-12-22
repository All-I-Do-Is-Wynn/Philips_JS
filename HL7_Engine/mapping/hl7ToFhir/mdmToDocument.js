// mapping/hl7ToFhir/mdmToDocumentReference.js
export function mdmToDocumentReference(nmo) {
  const pid = nmo.parsed.PID || [];
  const txa = nmo.parsed.TXA || [];

  return {
    resourceType: "DocumentReference",
    status: "current",
    type: {
      text: txa[2] || ""
    },
    subject: {
      reference: `Patient/${pid[3] || "unknown"}`
    },
    date: txa[6] || null,
    description: txa[25] || "",
    content: [
      {
        attachment: {
          contentType: "text/plain",
          title: txa[25] || "Document",
          url: "urn:mdm:payload" // placeholder
        }
      }
    ]
  };
}
