// fhirClientInteractive.js
import fetch from "node-fetch"; // Node ≥18 has native fetch, otherwise install
import readline from "readline";

// Define 5 sample FHIR resources
const fhirResources = {
  1: {
    "resourceType": "Patient",
    "id": "patient-example",
    "name": [{ use: "official", family: "Doe", given: ["John"] }],
    "gender": "male",
    "birthDate": "1980-01-01"
  },
  2: {
    resourceType: "Observation",
    id: "obs-example",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "29463-7", display: "Body Weight" }] },
    subject: { reference: "Patient/patient-example" },
    valueQuantity: { value: 72, unit: "kg" }
  },
  3: {
    resourceType: "Encounter",
    id: "enc-example",
    status: "finished",
    class: { system: "http://terminology.hl7.org/CodeSystem/v3-ActCode", code: "AMB" },
    subject: { reference: "Patient/patient-example" },
    period: { start: "2025-12-18T10:00:00Z", end: "2025-12-18T11:00:00Z" }
  },
  4: {
    resourceType: "Immunization",
    id: "imm-example",
    status: "completed",
    vaccineCode: { coding: [{ system: "http://hl7.org/fhir/sid/cvx", code: "207", display: "COVID-19 Vaccine" }] },
    patient: { reference: "Patient/patient-example" },
    occurrenceDateTime: "2025-12-18"
  },
  5: {
    resourceType: "MedicationRequest",
    id: "medreq-example",
    status: "active",
    intent: "order",
    medicationCodeableConcept: { coding: [{ system: "http://www.nlm.nih.gov/research/umls/rxnorm", code: "723", display: "Amoxicillin 500mg" }] },
    subject: { reference: "Patient/patient-example" },
    authoredOn: "2025-12-18",
    dosageInstruction: [{ text: "Take 1 capsule by mouth three times daily" }]
  }
};

// Function to send resource to FHIR listener
async function sendResource(resource) {
  try {
    const response = await fetch("http://localhost:3000/fhir", {
      method: "POST",
      headers: { "Content-Type": "application/fhir+json" },
      body: JSON.stringify(resource)
    });

    const data = await response.json();
    console.log("\n--- Server Response ---");
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error sending FHIR resource:", err.message);
  }
}

// Interactive menu
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("Select FHIR resource type to send:");
console.log("1 = Patient");
console.log("2 = Observation");
console.log("3 = Encounter");
console.log("4 = Immunization");
console.log("5 = MedicationRequest");

rl.question("Enter number (1-5): ", (answer) => {
  const choice = parseInt(answer, 10);
  if (!fhirResources[choice]) {
    console.error("Invalid choice. Please select 1-5.");
    rl.close();
    return;
  }
  sendResource(fhirResources[choice]);
  rl.close();
});
