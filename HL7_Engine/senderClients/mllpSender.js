// engine/senderClients/mllpSender.js
import net from "net";
import { log } from "../logStream.js";

const MLLP = {
  SB: 0x0b,
  EB: 0x1c,
  CR: 0x0d,
};

// Exported HL7 sample messages
export const hl7Messages = {
  1: "MSH|^~\\&|HOSPITAL|ADT|LAB|ADT|202512161946|1|ADT^A08|MSG00001|P|2.5\rEVN|A01|202512161946\rPID|1||123456^^^HOSPITAL^MR||DOE^JOHN||19800101|M",
  2: "MSH|^~\\&|HOSPITAL|ORM|LAB|ORM|202512161946||ORM^O01|MSG00002|P|2.5\rPID|1||789012^^^HOSPITAL^MR||SMITH^JANE||19900202|F\rORC|NW|ORD448811||\rOBR|1|ORD448811||CBC^Complete Blood Count",
  3: "MSH|^~\\&|HOSPITAL|ORU|LAB|ORU|202512161946||ORU^R01|MSG00003|P|2.5\rPID|1||345678^^^HOSPITAL^MR||BROWN^ALICE||19750303|F\rOBR|1|ORD998877||GLU^Glucose\rOBX|1|NM|GLU^Glucose||95|mg/dL|70-110|N|||F",
  4: "MSH|^~\\&|HOSPITAL|DFT|BILLING|DFT|202512161946||DFT^P03|MSG00004|P|2.5\rPID|1||111222^^^HOSPITAL^MR||WHITE^BOB||19640404|M\rFT1|1|202512161946||CG|Consultation|100|USD",
  5: "MSH|^~\\&|HOSPITAL|SIU|SCHED|SIU|202512161946||SIU^S12|MSG00005|P|2.5\rSCH|12345|202512201000|202512201030|APPT|Routine Checkup\rPID|1||222333^^^HOSPITAL^MR||GREEN^CAROL||19850505|F",
  6: "MSH|^~\\&|HOSPITAL|MDM|DOC|MDM|202512161946||MDM^T02|MSG00006|P|2.5\rPID|1||333444^^^HOSPITAL^MR||BLACK^DAVID||19760606|M\rTXA|1|PN|202512161946|202512161946|Report^Discharge Summary",
  7: "MSH|^~\\&|HOSPITAL|BAR|BILLING|BAR|202512161946||BAR^P01|MSG00007|P|2.5\rPID|1||444555^^^HOSPITAL^MR||KING^EMMA||19970707|F\rPV1|1|O|3000^3012^01||||5678^ATTENDING^PHYSICIAN",
  8: "MSH|^~\\&|HOSPITAL|RDE|PHARM|RDE|202512161946||RDE^O11|MSG00008|P|2.5\rPID|1||555666^^^HOSPITAL^MR||LEE^FRANK||19880808|M\rRXO|AMOX500^Amoxicillin 500mg||500mg|PO|TID",
  9: "MSH|^~\\&|HOSPITAL|RDS|PHARM|RDS|202512161946||RDS^O13|MSG00009|P|2.5\rPID|1||666777^^^HOSPITAL^MR||HALL^GRACE||19990909|F\rRXD|1|AMOX500^Amoxicillin 500mg|202512161946|500mg|PO|TID",
  10:"MSH|^~\\&|HOSPITAL|VXU|IMM|VXU|202512161946||VXU^V04|MSG00010|P|2.5\rPID|1||777888^^^HOSPITAL^MR||YOUNG^HENRY||20101010|M\rRXA|0|1|202512161946|202512161946|COVID19VAC^COVID-19 Vaccine|0.5|mL"
};

// MLLP framing
function frameMessage(message) {
  return Buffer.concat([
    Buffer.from([MLLP.SB]),
    Buffer.from(message, "utf8"),
    Buffer.from([MLLP.EB, MLLP.CR]),
  ]);
}


// Exported function for WebSocket usage
export function sendHL7(message, host = "127.0.0.1", port = 2575) {
  return new Promise((resolve, reject) => {
    const client = net.createConnection({ host, port }, () => {
      log(`Connected to MLLP server at ${host}:${port}`);
      const framed = frameMessage(message);
      client.write(framed);
      log("HL7 message sent");
    });

    client.on("data", (data) => {
      log("--- ACK/NACK Received ---");
      log(data.toString("utf8"));
      client.end();
      resolve();
    });

    client.on("end", () => {
      log("Disconnected from MLLP server");
    });

    client.on("error", (err) => {
      log(`HL7 client error: ${err.message}`);
      reject(err);
    });
  });
}
