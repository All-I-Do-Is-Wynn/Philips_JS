// normalizers/normalizefhir.js
export function normalizefhir(resource) {
  try {
    // --- Detect XML-converted JS objects (xml2js) ---
    // xml2js typically wraps the resource under a single root key
    let actual = resource;
    let resourceType = resource?.resourceType || null;

    if (!resourceType) {
      const keys = Object.keys(resource || {});
      if (keys.length === 1) {
        resourceType = keys[0];
        actual = resource[resourceType];
      }
    }

    // Helper to extract values from xml2js structures
    const extract = (node) => {
      if (!node) return null;

      // xml2js attribute value: { $: { value: "123" }}
      if (node.$?.value) return node.$.value;

      // xml2js array wrapper: [ { $: { value: "123" }} ]
      if (Array.isArray(node)) return extract(node[0]);

      // JSON FHIR: direct string
      if (typeof node === "string") return node;

      // JSON FHIR: direct object with reference
      if (node.reference) return extract(node.reference);

      return null;
    };

    // Extract patient reference (JSON or XML)
    const patientId =
      extract(actual?.subject?.reference) ||
      extract(actual?.subject) ||
      extract(actual?.patient?.reference) ||
      extract(actual?.patient) ||
      extract(actual?.id) ||
      null;

    return {
      protocol: "FHIR",
      type: null,
      resourceType,
      patientId,
      raw: resource,     // original input (JSON or XML-converted)
      parsed: actual,    // normalized inner object
      timestamp: new Date().toISOString()
    };

  } catch (err) {
    console.error("FHIR normalization error:", err.message);
    return {
      protocol: "FHIR",
      error: err.message,
      raw: resource,
      parsed: null,
      timestamp: new Date().toISOString()
    };
  }
}

  
  