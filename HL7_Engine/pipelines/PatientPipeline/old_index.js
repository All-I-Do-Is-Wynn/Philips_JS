import { mapEngine } from "../../mapping/mapEngine.js";

export default async function PatientPipeline(nmo) {
    console.log("\n[PatientPipeline] Processing Patient message...");
    console.log(JSON.stringify(nmo, null, 2));
  
    // TODO: Add transformations, DB writes, forwarding, etc.
    if (nmo.protocol === "HL7v2") {
        console.log("\n[PatientPipeline] Transforming HL7 → FHIR...");
        const fhir = await mapEngine("HL7v2", "FHIR", nmo);
    
        console.log("\n[PatientPipeline] FHIR Output:");
        console.log(JSON.stringify(fhir, null, 2));
      } else {
        console.log("[PatientPipeline] Not an HL7 message. No mapping performed.");
      }
}

  