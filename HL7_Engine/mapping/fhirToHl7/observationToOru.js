// mapping/fhirToHl7/observationToOru.js
export function observationToOru(obs) {
  const subjectId = obs.subject?.reference?.split("/")?.[1] || "";

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
    "ORU^R01",
    "MSGID123",
    "P",
    "2.5"
  ];

  const pid = ["PID", "", "", subjectId];

  const obr = [
    "OBR",
    "1",
    "",
    "",
    `${obs.code?.coding?.[0]?.code || ""}^${obs.code?.coding?.[0]?.display || ""}`,
    "",
    obs.effectiveDateTime || ""
  ];

  const obx = [
    "OBX",
    "1",
    obs.valueQuantity ? "NM" : "ST",
    `${obs.code?.coding?.[0]?.code || ""}^${obs.code?.coding?.[0]?.display || ""}`,
    "",
    obs.valueQuantity ? String(obs.valueQuantity.value || "") : obs.valueString || "",
    obs.valueQuantity?.unit || "",
    "",
    "",
    "",
    "",
    "F"
  ];

  return [msh, pid, obr, obx];
}

