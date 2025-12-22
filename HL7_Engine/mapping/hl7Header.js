// mapping/hl7Header.js

export function buildMSH(messageType, {
  sendingApp = "APP",
  sendingFacility = "FAC",
  receivingApp = "RCVAPP",
  receivingFacility = "RCVFAC",
  version = "2.5"
} = {}) {

  const timestamp = new Date().toISOString();
  const controlId = Math.floor(Math.random() * 1_000_000_000).toString();

  return [
    "MSH",
    "|",
    "^~\\&",
    sendingApp,
    sendingFacility,
    receivingApp,
    receivingFacility,
    timestamp,
    "",
    messageType,     // e.g., "ADT^A01"
    controlId,       // unique message control ID
    "P",
    version
  ];
}
