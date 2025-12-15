import fetch from "node-fetch";

// Test Code

const FHIR_BASE_URL = "https://hapi.fhir.org/baseR4";

async function fetchPatients() {
  const response = await fetch(`${FHIR_BASE_URL}/Patient?_count=1`);
  const bundle = await response.json();

  if (bundle.entry && bundle.entry.length > 0) {
    const patient = bundle.entry[0].resource;
    console.log("Fetched Patient:", patient.id);
    console.log("Name:", patient.name?.[0]?.given?.[0], patient.name?.[0]?.family);
  } else {
    console.log("No patients found.");
  }
}

fetchPatients();