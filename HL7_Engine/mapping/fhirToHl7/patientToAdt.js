// mapping/fhirToHl7/patientToAdt.js
export function patientToAdt(patient) {
  const name = patient.name?.[0] || {};
  const family = name.family || "";
  const given = name.given?.[0] || "";

  const gender =
    patient.gender === "male"
      ? "M"
      : patient.gender === "female"
      ? "F"
      : "U";

  const pidSegment = [
    "PID",
    "",
    "",
    patient.id || "",
    "",
    `${family}^${given}`,
    "",
    patient.birthDate || "",
    gender
  ];

  const mshSegment = [
    "MSH",
    "|",
    "^~\\&",
    "APP",
    "FAC",
    "RCVAPP",
    "RCVFAC",
    new Date().toISOString(),
    "",
    "ADT^A01",
    "MSGID123",
    "P",
    "2.5"
  ];

  return [mshSegment, pidSegment];
}

  