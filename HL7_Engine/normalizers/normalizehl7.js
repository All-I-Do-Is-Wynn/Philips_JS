import { parseHL7 } from "../utils/parseHL7.js"; // your parser module

export function normalizeHL7(rawHL7) {
  try {
    const parsed = parseHL7(rawHL7); // Convert HL7 → JSON structure

    const messageType = parsed?.MSH?.[8] || null; // e.g., "ADT^A01"
    const patientId = parsed?.PID?.[5] || null;

    return {
      protocol: "HL7v2",
      type: messageType,
      resourceType: null,
      patientId,
      raw: rawHL7,
      parsed,
      timestamp: new Date().toISOString()
    };
  } catch (err) {
    console.error("HL7 normalization error:", err.message);
    return {
      protocol: "HL7v2",
      error: err.message,
      raw: rawHL7,
      parsed: null,
      timestamp: new Date().toISOString()
    };
  }
}
  
  