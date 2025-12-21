// router/routingRules.js

export const routingRules = {
    HL7v2: [
      {
        match: (nmo) => nmo.type?.startsWith("ADT"),
        pipeline: "PatientPipeline"
      },
      {
        match: (nmo) => nmo.type?.startsWith("ORU"),
        pipeline: "ObservationPipeline"
      },
      {
        match: (nmo) => nmo.type?.startsWith("SIU"),
        pipeline: "EncounterPipeline"
      }
    ],
  
    FHIR: [
      {
        match: (nmo) => nmo.resourceType === "Patient",
        pipeline: "PatientPipeline"
      },
      {
        match: (nmo) => nmo.resourceType === "Observation",
        pipeline: "ObservationPipeline"
      },
      {
        match: (nmo) => nmo.resourceType === "Encounter",
        pipeline: "EncounterPipeline"
      }
    ]
  };
  