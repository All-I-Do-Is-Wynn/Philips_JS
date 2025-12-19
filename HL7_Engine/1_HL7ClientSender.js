// mllpClient.js
import net from "net";

// MLLP framing characters
const MLLP = {
  SB: 0x0b, // Start Block (VT)
  EB: 0x1c, // End Block (FS)
  CR: 0x0d, // Carriage Return
};

// Example HL7 ADT^A01 message
const hl7Message = [
  "MSH|^~\\&|HOSPITAL|ADT|LAB|ADT|202512161946||ADT^A01|MSG00001|P|2.5",
  "EVN|A01|202512161946",
  "PID|1||123456^^^HOSPITAL^MR||DOE^JOHN||19800101|M|||123 MAIN ST^^LOUISVILLE^KY^40202||(502)555-1234|||M||123456789",
  "PV1|1|I|2000^2012^01||||1234^PRIMARY^PHYSICIAN||||||||||||"
].join("\r");

// Wrap message in MLLP framing
function frameMessage(message) {
  return Buffer.concat([
    Buffer.from([MLLP.SB]),
    Buffer.from(message, "utf8"),
    Buffer.from([MLLP.EB, MLLP.CR]),
  ]);
}

// Send HL7 message to MLLP server
function sendMessage(host = "127.0.0.1", port = 2575) {
  const client = net.createConnection({ host, port }, () => {
    console.log(`Connected to MLLP server at ${host}:${port}`);
    const framed = frameMessage(hl7Message);
    client.write(framed);
    console.log("HL7 message sent.");
  });

  client.on("data", (data) => {
    console.log("\n--- ACK/NACK Received ---\n" + data.toString("utf8"));
    client.end();
  });

  client.on("end", () => {
    console.log("Disconnected from server.");
  });

  client.on("error", (err) => {
    console.error("Client error:", err.message);
  });
}

// Run the client
sendMessage();
