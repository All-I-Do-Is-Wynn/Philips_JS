// engine/listeners/mllpManager.js
import net from "net";
import { normalizeHL7 } from "../normalizers/normalizehl7.js";
import { routeMessage } from "../router/routeMessage.js";
import { log } from "../logStream.js";

const MLLP = {
  SB: 0x0b,
  EB: 0x1c,
  CR: 0x0d,
};

let mllpServer = null;

/**
 * Build HL7 ACK/NACK message wrapped in MLLP framing
 */
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

/**
 * Start the MLLP listener (WebSocket controlled)
 */
export function startMllp(port = 2575, host = "0.0.0.0") {
  if (mllpServer) {
    log("MLLP listener already running");
    return;
  }

  mllpServer = net.createServer((socket) => {
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

        log("--- Raw HL7 Message Received ---");
        log(message.replace(/\r/g, "\n"));

        try {
          // Normalize HL7
          const nmo = normalizeHL7(message);

          log("--- Normalized HL7 Message Object ---");
          log(JSON.stringify(nmo, null, 2));

          // Route
          routeMessage(nmo);

          // ACK
          const ack = buildAck(message, "AA");
          socket.write(ack);
          log("ACK sent");
        } catch (err) {
          log(`HL7 message handling error: ${err.message}`);
          const nack = buildAck(message, "AE");
          socket.write(nack);
          log("NACK sent");
        }
      }
    });

    socket.on("error", (e) => log(`MLLP socket error: ${e.message}`));
  });

  mllpServer.listen(port, host, () => {
    log(`MLLP listener started on ${host}:${port}`);
  });

  mllpServer.on("error", (e) => log(`MLLP server error: ${e.message}`));
}

/**
 * Stop the MLLP listener
 */
export function stopMllp() {
  if (!mllpServer) {
    log("MLLP listener is not running");
    return;
  }

  mllpServer.close(() => {
    log("MLLP listener stopped");
    mllpServer = null;
  });
}
