// mapping/fhirToHl7/observationToOru.js

export function observationToOru(nmo) {
    const o = nmo.parsed;
  
    const msh = `MSH|^~\\&|FHIR|ENGINE|HL7|ENGINE|${nmo.timestamp}||ORU^R01|${o.id}|P|2.5`;
    const pid = `PID|1||${nmo.patientId}`;
    const obx = `OBX|1|NM|${o.code?.coding?.[0]?.code}^${o.code?.coding?.[0]?.display}||${o.valueQuantity?.value}|${o.valueQuantity?.unit}`;
  
    return `${msh}\r${pid}\r${obx}\r`;
  }
  