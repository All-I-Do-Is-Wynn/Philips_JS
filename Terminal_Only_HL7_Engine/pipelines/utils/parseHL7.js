// utils/parseHL7.js

/**
 * Very lightweight HL7 v2 parser.
 * Converts raw HL7 text into a JSON object:
 * {
 *   MSH: ["MSH", "|", "^~\\&", ...],
 *   PID: ["PID", "12345", ...],
 *   OBR: [...],
 *   OBX: [...],
 *   ...
 * }
 */

export function parseHL7(raw) {
    if (!raw || typeof raw !== "string") {
      throw new Error("Invalid HL7 input");
    }
  
    // Normalize line endings
    const cleaned = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  
    const segments = cleaned
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0);
  
    const hl7 = {};
  
    for (const segment of segments) {
      const fields = segment.split("|", -1);
      const segmentType = fields[0];
  
      if (!hl7[segmentType]) {
        // First occurrence → store as array
        hl7[segmentType] = fields;
      } else {
        // Multiple segments of same type → convert to array of arrays
        if (!Array.isArray(hl7[segmentType][0])) {
          hl7[segmentType] = [hl7[segmentType]];
        }
        hl7[segmentType].push(fields);
      }
    }
  
    return hl7;
  }
  