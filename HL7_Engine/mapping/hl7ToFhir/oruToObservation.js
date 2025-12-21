// mapping/hl7ToFhir/oruToObservation.js

export function oruToObservation(nmo) {
    const obx = Array.isArray(nmo.parsed.OBX)
      ? nmo.parsed.OBX[0]
      : nmo.parsed.OBX;
  
    return {
      resourceType: "Observation",
      status: "final",
      code: {
        coding: [
          {
            system: "urn:oid:2.16.840.1.113883.6.1",
            code: obx[3]?.split("^")[0],
            display: obx[3]?.split("^")[1]
          }
        ]
      },
      valueQuantity: {
        value: obx[5],
        unit: obx[6]
      },
      subject: {
        reference: `Patient/${nmo.patientId}`
      }
    };
  }
  