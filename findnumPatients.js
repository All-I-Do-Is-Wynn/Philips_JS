import fetch from "node-fetch";

const FHIR_BASE_URL = "https://hapi.fhir.org/baseR4";

async function fetchPatients() {
  try {
    // Search for patients (limit to 5 results)
    const response = await fetch(`${FHIR_BASE_URL}/Patient?_count=30`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const bundle = await response.json();

    if (bundle.entry && bundle.entry.length > 0) {
      bundle.entry.forEach((entry, index) => {
        const patient = entry.resource;
        const nameObj = patient.name?.[0] || {};
        const given = nameObj.given?.[0] || "N/A";
        const family = nameObj.family || "N/A";
        console.log(`Patient ${index + 1}: ${given} ${family} (ID: ${patient.id})`);
      });
    } else {
      console.log("No patients found.");
    }
  } catch (error) {
    console.error("Error fetching patients:", error.message);
  }
}

fetchPatients();
