import fetch from "node-fetch";

const FHIR_BASE_URL = "https://hapi.fhir.org/baseR4";

// FHIR Attributes syntax found -> https://hl7.org/fhir/patient-definitions.html#Patient.identifier

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
        console.log(`\n--- Patient ${index + 1} ---`);

        // Core identifiers
        console.log("ID:", patient.id || "N/A");
        console.log("Identifier(s):", patient.identifier?.map(i => `${i.system || ""}:${i.value || ""}`) || "N/A");

        // Name
        const nameObj = patient.name?.[0] || {};
        console.log("Name:", `${nameObj.given?.[0] || "N/A"} ${nameObj.family || ""}`);

        // Contact info
        console.log("Telecom:", patient.telecom?.map(t => `${t.system}: ${t.value}`) || "N/A");

        // Demographics
        console.log("Gender:", patient.gender || "N/A");
        console.log("Birth Date:", patient.birthDate || "N/A");
        console.log("Deceased:", patient.deceasedBoolean ?? patient.deceasedDateTime ?? "N/A");

        // Address
        console.log("Address:", patient.address?.map(a => `${a.line?.join(" ") || ""}, ${a.city || ""}, ${a.state || ""}, ${a.postalCode || ""}, ${a.country || ""}`) || "N/A");

        // Marital status
        console.log("Marital Status:", patient.maritalStatus?.text || "N/A");

        // Communication
        console.log("Communication:", patient.communication?.map(c => c.language?.text || "N/A") || "N/A");

        // Practitioner / Organization
        console.log("General Practitioner:", patient.generalPractitioner?.map(gp => gp.reference) || "N/A");
        console.log("Managing Organization:", patient.managingOrganization?.reference || "N/A");

        // Photo
        console.log("Photo:", patient.photo?.map(p => p.url || p.data || "N/A") || "N/A");

        // Emergency contacts
        console.log("Contact(s):", patient.contact?.map(c => `${c.relationship?.[0]?.text || ""}: ${c.name?.given?.[0] || ""} ${c.name?.family || ""}`) || "N/A");

        // Links to other records
        console.log("Link(s):", patient.link?.map(l => l.other?.reference || "N/A") || "N/A");
      });
    } else {
      console.log("No patients found.");
    }
  } catch (error) {
    console.error("Error fetching patients:", error.message);
  }
}

fetchPatients();