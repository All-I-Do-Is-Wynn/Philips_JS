// mapping/fhirToHl7/encounterToAdt.js
import { buildMSH } from "../hl7Header.js";
import { log } from "../../logStream.js";

export function encounterToAdt(encounter) {
  const subjectId = encounter.subject?.reference?.split("/")?.[1] || "";
  const start = encounter.period?.start || "";
  const end = encounter.period?.end || "";
  const classCode = encounter.class?.code || "AMB";

  // Determine ADT event
  let event = "ADT^A08"; // default update

  if (encounter.status === "in-progress") {
    event = "ADT^A01"; // admit/start visit
    //log("Visit start -> A01.");
  }

  if (encounter.status === "finished") {
    event = "ADT^A03"; // discharge/end visit
    //log("Visit end/discharge -> A03.");
  }

  const msh = buildMSH(event);

  // PID
  const pid = ["PID", "", "", subjectId];

  // PV1
  const pv1 = [
    "PV1",
    "1",
    classCode === "AMB" ? "O" : classCode, // AMB → Outpatient
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
    encounter.id || "", // PV1-19 Visit Number
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
    start ? start.replace(/[-:]/g, "").replace("T", "").replace("Z", "") : "",
    end ? end.replace(/[-:]/g, "").replace("T", "").replace("Z", "") : ""
  ];

  return [msh, pid, pv1];
}
