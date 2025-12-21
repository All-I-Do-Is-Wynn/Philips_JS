// mapping/hl7ToFhir/adtToPatient.js

export function adtToPatient(nmo) {
    const pid = nmo.parsed.PID;
  
    return {
      resourceType: "Patient",
      id: pid[3] || "unknown",
      name: [
        {
          family: pid[5]?.split("^")[0] || "",
          given: [pid[5]?.split("^")[1] || ""]
        }
      ],
      gender: pid[8] === "M" ? "male" : pid[8] === "F" ? "female" : "unknown",
      birthDate: pid[7] || null
    };
  }
  