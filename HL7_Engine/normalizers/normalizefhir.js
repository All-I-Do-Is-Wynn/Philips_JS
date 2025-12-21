// normalizers/normalizefhir.js
export function normalizefhir(resource) {
    try {
      const resourceType = resource?.resourceType || null;
  
      // Patient reference may appear in different places depending on resource type
      const patientId =
        resource?.subject?.reference ||
        resource?.patient?.reference ||
        resource?.id ||
        null;
  
      return {
        protocol: "FHIR",
        type: null,
        resourceType,
        patientId,
        raw: resource,
        parsed: resource,
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
  
  