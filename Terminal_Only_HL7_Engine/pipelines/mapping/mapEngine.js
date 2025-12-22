import * as HL7toFHIR from "./hl7ToFhir/index.js";
import * as FHIRtoHL7 from "./fhirToHl7/index.js";

export async function mapEngine(from, to, nmo) {
  console.log(`\n[Mapping Engine] ${from} → ${to}`);

  if (from === "HL7v2" && to === "FHIR") {
    return HL7toFHIR.mapHL7toFHIR(nmo);
  }

  if (from === "FHIR" && to === "HL7v2") {
    return FHIRtoHL7.mapFHIRtoHL7(nmo);
  }

  throw new Error(`Unsupported mapping: ${from} → ${to}`);
}
