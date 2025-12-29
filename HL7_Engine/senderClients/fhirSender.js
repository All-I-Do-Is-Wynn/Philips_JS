// FHIR Sender Client (WebSocket-ready)
import { log, logs } from "../logStream.js";
import fetch from "node-fetch";
import { create } from "xmlbuilder2";


// Example FHIR resources
export const fhirResources = {
  1: {
    resourceType: "Patient",
    id: "patient-example",
    name: [{ use: "official", family: "Doe", given: ["John"] }],
    gender: "male",
    birthDate: "1980-01-01"
  },
  2: {
    resourceType: "Observation",
    id: "obs-example",
    status: "final",
    code: {
      coding: [
        {
          system: "http://loinc.org",
          code: "29463-7",
          display: "Body Weight"
        }
      ]
    },
    subject: { reference: "Patient/patient-example" },
    valueQuantity: { value: 72, unit: "kg" }
  },
  3: {
    resourceType: "Encounter",
    id: "enc-example",
    status: "finished",
    class: {
      system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
      code: "AMB"
    },
    subject: { reference: "Patient/patient-example" },
    period: {
      start: "2025-12-18T10:00:00Z",
      end: "2025-12-18T11:00:00Z"
    }
  },
  4: {
    resourceType: "Immunization",
    id: "imm-example",
    status: "completed",
    vaccineCode: {
      coding: [
        {
          system: "http://hl7.org/fhir/sid/cvx",
          code: "207",
          display: "COVID-19 Vaccine"
        }
      ]
    },
    patient: { reference: "Patient/patient-example" },
    occurrenceDateTime: "2025-12-18"
  },
  5: {
    resourceType: "MedicationRequest",
    id: "medreq-example",
    status: "active",
    intent: "order",
    medicationCodeableConcept: {
      coding: [
        {
          system: "http://www.nlm.nih.gov/research/umls/rxnorm",
          code: "723",
          display: "Amoxicillin 500mg"
        }
      ]
    },
    subject: { reference: "Patient/patient-example" },
    authoredOn: "2025-12-18",
    dosageInstruction: [
      { text: "Take 1 capsule by mouth three times daily" }
    ]
  }
};

function convertToFhirXml(obj) {
  if (obj === null || obj === undefined) return null;

  // Primitive value → FHIR attribute
  if (typeof obj === "string" || typeof obj === "number" || typeof obj === "boolean") {
    return { "@value": obj };
  }

  // Arrays → list of elements
  if (Array.isArray(obj)) {
    return obj.map(item => convertToFhirXml(item));
  }

  // Objects → nested XML
  const result = {};
  for (const key of Object.keys(obj)) {
    result[key] = convertToFhirXml(obj[key]);
  }
  return result;
}


// Convert JSON → XML string
function toXml(resource) {
  const rootName = resource.resourceType;

  // Clone without resourceType
  const { resourceType, ...rest } = resource;

  const xmlObj = {
    [rootName]: {
      "@xmlns": "http://hl7.org/fhir",
      ...convertToFhirXml(rest)
    }
  };

  return create(xmlObj).end({ prettyPrint: true });
}



// Exported function for WebSocket usage
export async function sendResource(resource, format = "json") {
  try {
    let body;
    let contentType;

    if (format === "xml") {
      body = toXml(resource);
      contentType = "application/fhir+xml";
    } else {
      body = JSON.stringify(resource);
      contentType = "application/fhir+json";
    }

    const response = await fetch("http://localhost:3000/fhir", {
      method: "POST",
      headers: { "Content-Type": contentType },
      body
    });
    log(body);
    const data = await response.json();
    console.log("\n--- FHIR Listener Response ---");
    console.log(JSON.stringify(data, null, 2));

  } catch (err) {
    console.error("Error sending FHIR resource:", err.message);
  }
}

