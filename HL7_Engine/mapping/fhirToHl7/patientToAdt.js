// mapping/fhirToHl7/patientToAdt.js

export function patientToAdt(nmo) {
    const p = nmo.parsed;
  
    const msh = `MSH|^~\\&|FHIR|ENGINE|HL7|ENGINE|${nmo.timestamp}||ADT^A08|${p.id}|P|2.5`;
    const pid = `PID|1||${p.id}||${p.name?.[0]?.family}^${p.name?.[0]?.given?.[0]}||${p.birthDate}|||`;
  
    return `${msh}\r${pid}\r`;
  }
  