// mapping/fhirToHl7/encounterToSiu.js
import { buildMSH } from "../hl7Header.js";

export function encounterToSiu(encounter) {
  const subjectId = encounter.subject?.reference?.split("/")?.[1] || "";
  const start = encounter.period?.start || "";
  const end = encounter.period?.end || "";
  const service = encounter.serviceType?.text || "";

  const msh = buildMSH("SIU^S12");

  // PID
  const pid = ["PID", "", "", subjectId];

  // PV1 (required by most SIU messages)
  const pv1 = [
    "PV1",
    "1",
    encounter.class?.code || "AMB", // default ambulatory
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
  ];

  // SCH (Scheduling Activity Information)
  const sch = [
    "SCH",
    encounter.id || "", // SCH-1 placer ID
    encounter.id || "", // SCH-2 filler ID
    "",
    "",
    service,            // SCH-6 appointment reason
    "",
    "",
    "",
    "",
    start,              // SCH-11 start time
    end                 // SCH-12 end time
  ];

  // RGS (Resource Group)
  const rgs = ["RGS", "1"];

  // AIG (General Resource)
  const aig = ["AIG", "1", "", "", service];

  // AIL (Location Resource)
  const ail = ["AIL", "1", "", encounter.location?.[0]?.location?.reference || ""];

  // AIP (Provider Resource)
  const aip = ["AIP", "1", "", encounter.participant?.[0]?.individual?.reference || ""];

  return [msh, sch, pid, pv1, rgs, aig, ail, aip];
}

