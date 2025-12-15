// Import Fetch
import fetch from "node-fetch";

// Base FHIR server (public test endpoint)
const FHIR_BASE_URL = "https://hapi.fhir.org/baseR4";
const PATIENT_ID = "47936499"; // Replace with a real patient ID

async function fetchPatient() {
    try {
        const response = await fetch(`${FHIR_BASE_URL}/Patient/${PATIENT_ID}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const patient = await response.json();

        // Parse key fields
        const id = patient.id || "N/A";
        const nameObj = patient.name?.[0] || {};
        const given = nameObj.given?.[0] || "N/A";
        const family = nameObj.family || "N/A";
        const gender = patient.gender || "N/A";
        const birthDate = patient.birthDate || "N/A";
    
        console.log(`Patient ID: ${id}`);
        console.log(`Name: ${given} ${family}`);
        console.log(`Gender: ${gender}`);
        console.log(`Birth Date: ${birthDate}`);
    }   catch (error) {
        console.error("Error fetching patient:", error.message);
    }
}

fetchPatient();





