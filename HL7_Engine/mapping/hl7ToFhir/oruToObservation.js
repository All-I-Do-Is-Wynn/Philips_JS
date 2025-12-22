// mapping/hl7ToFhir/oruToObservation.js
export function oruToObservation(nmo) {
  const obr = nmo.parsed.OBR || [];
  const obx = nmo.parsed.OBX || [];
  const pid = nmo.parsed.PID || [];

  return {
    resourceType: "Observation",
    status: "final",
    code: {
      coding: [
        {
          system: "http://loinc.org",
          code: obx[3]?.split("^")[0] || "",
          display: obx[3]?.split("^")[1] || ""
        }
      ],
      text: obx[3]?.split("^")[1] || ""
    },
    subject: {
      reference: `Patient/${pid[3] || "unknown"}`
    },
    effectiveDateTime: obr[7] || null,
    valueQuantity: obx[2] === "NM"
      ? {
          value: parseFloat(obx[5]) || null,
          unit: obx[6]?.split("^")[1] || obx[6] || null
        }
      : undefined,
    valueString: obx[2] !== "NM" ? obx[5] || null : undefined
  };
}

  