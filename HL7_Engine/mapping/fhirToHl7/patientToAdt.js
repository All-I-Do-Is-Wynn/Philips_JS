import { buildMSH } from "../hl7Header.js";

export function patientToAdt(patient) {
  const msh = buildMSH("ADT^A08");

  const name = patient.name?.[0] || {};
  const family = name.family || "";
  const given = name.given?.[0] || "";

  const gender =
    patient.gender === "male"
      ? "M"
      : patient.gender === "female"
      ? "F"
      : "U";

  const pid = [
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

  return [msh, pid];
}

  