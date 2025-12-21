const ws = new WebSocket("ws://localhost:8081");

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);

  if (msg.type === "logs") {
    document.getElementById("terminal").textContent =
      msg.data.join("\n");
  }
};

function send(action) {
  ws.send(JSON.stringify({ action }));
}

function sendFHIR(index) {
  ws.send(JSON.stringify({ action: "send-fhir", index }));
}

function sendHL7(index) {
  ws.send(JSON.stringify({ action: "send-hl7", index }));
}
