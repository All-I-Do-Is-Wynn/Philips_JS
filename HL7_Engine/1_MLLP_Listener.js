// mllpListener.js
import net from "net";

/**
 * Minimal MLLP server:
 * - Frames HL7 messages with SB (0x0B) and EB+CR (0x1C 0x0D)
 * - Buffers incoming data and extracts discrete messages by framing
 * - Sends an HL7 ACK on successful receipt
 */

const MLLP = {
  SB: 0x0b,      // Start Block (VT)
  EB: 0x1c,      // End Block (FS)
  CR: 0x0d,      // Carriage Return
};

function buildAck(originalMessage, ackCode = "AA") {
  // Very basic ACK builder; customize MSA fields per your needs
  const now = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
  const controlId = /MSH\|[^\n]*\|.*\|.*\|.*\|.*\|.*\|.*\|.*\|(.*)\|/.exec(originalMessage)?.[1] || "MSGID";
  const msh = `MSH|^~\\&|HL7ENGINE|INGEST|SENDER|FACILITY|${now}||ACK^A01|ACK${controlId}|P|2.5`;
  const msa = `MSA|${ackCode}|${controlId}`;
  const ackMessage = `${msh}\r${msa}\r`;
  const framed = Buffer.concat([
    Buffer.from([MLLP.SB]),
    Buffer.from(ackMessage, "utf8"),
    Buffer.from([MLLP.EB, MLLP.CR]),
  ]);
  return framed;
}

export function startMllpServer({ host = "0.0.0.0", port = 2575, onMessage }) {
  const server = net.createServer((socket) => {
    let buffer = Buffer.alloc(0);

    socket.on("data", (chunk) => {
      buffer = Buffer.concat([buffer, chunk]);

      // Extract messages framed by SB ... EB CR
      while (true) {
        const sbIndex = buffer.indexOf(MLLP.SB);
        const ebIndex = buffer.indexOf(MLLP.EB, sbIndex + 1);
        const crIndex = buffer.indexOf(MLLP.CR, ebIndex + 1);

        if (sbIndex === -1 || ebIndex === -1 || crIndex === -1) break;

        const msgBuffer = buffer.slice(sbIndex + 1, ebIndex); // exclude SB and EB
        const message = msgBuffer.toString("utf8");

        // Trim consumed bytes
        buffer = buffer.slice(crIndex + 1);

        // Handle HL7 message
        try {
          onMessage?.(message, socket);
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

// Example usage:
startMllpServer({
  port: 2575,
  onMessage: (hl7, socket) => {
    console.log("\n--- HL7 v2 Message Received ---\n" + hl7);
    // TODO: Parse HL7 segments, route to your pipeline, persist in DB, etc.
  },
});
