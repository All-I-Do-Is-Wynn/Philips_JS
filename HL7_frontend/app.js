const ws = new WebSocket("ws://localhost:8081");

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);

  if (msg.type === "logs") {
    document.getElementById("terminal").textContent =
      msg.data.join("\n");
  }

  if (msg.type === "preview") {
    document.getElementById("previewBox").textContent = msg.data;
  }
};

function send(action) {
  ws.send(JSON.stringify({ action }));
}

function sendHL7() {
  const index = document.getElementById("hl7Select").value;
  ws.send(JSON.stringify({ action: "send-hl7", index }));
}

function sendFHIR() {
  const index = document.getElementById("fhirSelect").value;
  ws.send(JSON.stringify({ action: "send-fhir", index }));
}

function updateHL7Preview() {
  const index = document.getElementById("hl7Select").value;
  ws.send(JSON.stringify({ action: "preview-hl7", index }));
}

function updateFHIRPreview() {
  const index = document.getElementById("fhirSelect").value;
  ws.send(JSON.stringify({ action: "preview-fhir", index }));
}

function previewHL7Route() {
  const index = document.getElementById("hl7Select").value;
  ws.send(JSON.stringify({ action: "preview-route-hl7", index }));
}

function runHL7Route() {
  const index = document.getElementById("hl7Select").value;
  ws.send(JSON.stringify({ action: "run-route-hl7", index }));
}

function previewFHIRRoute() {
  const index = document.getElementById("fhirSelect").value;
  ws.send(JSON.stringify({ action: "preview-route-fhir", index }));
}

function runFHIRRoute() {
  const index = document.getElementById("fhirSelect").value;
  ws.send(JSON.stringify({ action: "run-route-fhir", index }));
}


