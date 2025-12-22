// mllpListener.js
import net from "net";
import { normalizeHL7 } from "../normalizers/normalizehl7.js";
import { routeMessage } from "../router/routeMessage_OTU.js";

const MLLP = {
  SB: 0x0b,
  EB: 0x1c,
  CR: 0x0d,
};

function buildAck(originalMessage, ackCode = "AA") {
  const now = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
  const controlId =
    /MSH\|[^\n]*\|.*\|.*\|.*\|.*\|.*\|.*\|.*\|(.*)\|/.exec(originalMessage)?.[1] ||
    "MSGID";

  const msh = `MSH|^~\\&|HL7ENGINE|INGEST|SENDER|FACILITY|${now}||ACK^A01|ACK${controlId}|P|2.5`;
  const msa = `MSA|${ackCode}|${controlId}`;
  const ackMessage = `${msh}\r${msa}\r`;

  return Buffer.concat([
    Buffer.from([MLLP.SB]),
    Buffer.from(ackMessage, "utf8"),
    Buffer.from([MLLP.EB, MLLP.CR]),
  ]);
}

export function startMllpServer({ host = "0.0.0.0", port = 2575, onMessage }) {
  const server = net.createServer((socket) => {
    let buffer = Buffer.alloc(0);

    socket.on("data", (chunk) => {
      buffer = Buffer.concat([buffer, chunk]);

      while (true) {
        const sbIndex = buffer.indexOf(MLLP.SB);
        const ebIndex = buffer.indexOf(MLLP.EB, sbIndex + 1);
        const crIndex = buffer.indexOf(MLLP.CR, ebIndex + 1);

        if (sbIndex === -1 || ebIndex === -1 || crIndex === -1) break;

        const msgBuffer = buffer.slice(sbIndex + 1, ebIndex);
        const message = msgBuffer.toString("utf8");

        buffer = buffer.slice(crIndex + 1);

        try {
          // 🔥 Normalize HL7
          const nmo = normalizeHL7(message);

          console.log("\n--- Normalized HL7 Message Object ---");
          console.log(JSON.stringify(nmo, null, 2));

          // 🔀 Route it
          routeMessage(nmo);

          // ACK
          const ack = buildAck(message, "AA");
          socket.write(ack);
        } catch (err) {
          console.error("Message handling error:", err.message);
          const nack = buildAck(message, "AE");
          socket.write(nack);
        }
      }
    });

    socket.on("error", (e) => console.error("MLLP socket error:", e.message));
  });

  server.listen(port, host, () => {
    console.log(`MLLP server listening on ${host}:${port}`);
  });

  server.on("error", (e) => console.error("MLLP server error:", e.message));
  return server;
}

// Example usage
startMllpServer({
  port: 2575,
  onMessage: (hl7) => {
    const pretty = hl7.replace(/\r/g, "\n");
    console.log("\n--- Raw HL7 Message Received ---");
    console.log(pretty);
  },
});
