// mapping/hl7ToFhir/siuToEncounter.js
export function siuToEncounter(nmo) {
  const sch = nmo.parsed.SCH || [];
  const pid = nmo.parsed.PID || [];
  const pv1 = nmo.parsed.PV1 || [];

  return {
    resourceType: "Encounter",
    id: sch[1] || "unknown",
    status: "planned",
    class: {
      system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
      code: pv1[2] || "AMB"
    },
    subject: {
      reference: `Patient/${pid[3] || "unknown"}`
    },
    period: {
      start: sch[11] || null,
      end: sch[12] || null
    },
    serviceType: {
      text: sch[7] || ""
    }
  };
}
