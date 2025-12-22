// mapping/hl7Serialize.js

// Serialize arrays when doing fhir -> normalized object -> HL7 format
export function segmentsToHL7(segments) {
  return segments
    .map(segment => segment.join("|"))
    .join("\n"); // or "\n" if you prefer in UI
}

export function extractHL7Segments(routed) {
  if (!routed) return null;

  // Direct array-of-arrays
  if (Array.isArray(routed) && Array.isArray(routed[0])) {
    return routed;
  }

  // Common wrapper keys
  const keys = ["hl7", "segments", "result", "mapped"];
  for (const key of keys) {
    if (Array.isArray(routed[key]) && Array.isArray(routed[key][0])) {
      return routed[key];
    }
  }

  return null;
}
