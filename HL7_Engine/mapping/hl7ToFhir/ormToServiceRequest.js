// mapping/hl7ToFhir/ormToServiceRequest.js
export function ormToServiceRequest(nmo) {
  const pid = nmo.parsed.PID || [];
  const orc = nmo.parsed.ORC || [];
  const obr = nmo.parsed.OBR || [];

  return {
    resourceType: "ServiceRequest",
    status: "active",
    intent: "order",
    subject: {
      reference: `Patient/${pid[3] || "unknown"}`
    },
    code: {
      coding: [
        {
          system: "http://loinc.org",
          code: obr[4]?.split("^")[0] || "",
          display: obr[4]?.split("^")[1] || ""
        }
      ],
      text: obr[4]?.split("^")[1] || ""
    },
    authoredOn: orc[9] || null
  };
}
