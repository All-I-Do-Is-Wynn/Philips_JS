// Fetches Procedures from a given patient
// If Node >=18, you can remove this import line
import fetch from "node-fetch";

const FHIR_BASE_URL = "https://hapi.fhir.org/baseR4";

// Replace with a real patient ID from the server
const PATIENT_ID = "47936500";

async function fetchProceduresForPatient(patientId) {
  try {
    // Query for procedures tied to this patient
    const response = await fetch(`${FHIR_BASE_URL}/Procedure?patient=${patientId}&_count=5`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const bundle = await response.json();

    if (bundle.entry && bundle.entry.length > 0) {
      console.log(`Found ${bundle.entry.length} procedures for Patient ${patientId}:`);
      bundle.entry.forEach((entry, index) => {
        const procedure = entry.resource;
        console.log(`\n--- Procedure ${index + 1} ---`);
        console.log("ID:", procedure.id || "N/A");
        console.log("Status:", procedure.status || "N/A");
        console.log("Code:", procedure.code?.text || "N/A");
        console.log("Performed:", procedure.performedDateTime || "N/A");
        console.log("Performer:", procedure.performer?.map(p => p.actor?.reference).join(", ") || "N/A");
      });
    } else {
      console.log(`No procedures found for Patient ${patientId}.`);
    }
  } catch (error) {
    console.error("Error fetching procedures:", error.message);
  }
}

fetchProceduresForPatient(PATIENT_ID);
