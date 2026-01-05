const ws = new WebSocket("ws://localhost:8444");
console.log("APP.JS LOADED at", Date.now());

console.log("APP.JS VERSION 9999");
ws.onopen = () => console.log("WS OPEN");
ws.onerror = (err) => console.log("WS ERROR", err);
ws.onclose = () => console.log("WS CLOSED");
console.log("RAW WS MESSAGE:");

window.updateFHIRXMLPreview = updateFHIRXMLPreview;


ws.onmessage = (event) => {
    
  let msg;

  try {
    msg = JSON.parse(event.data);
  } catch (err) {
    console.error("WS JSON parse failed:", err);
    return;
  }

  if (msg.type === "logs") {
    document.getElementById("terminal").textContent =
      msg.data.join("\n");
  }

  if (msg.type === "preview") {
  const formatted = typeof msg.data === "string"
    ? msg.data.replace(/\r/g, "\n")
    : msg.data;

  document.getElementById("previewBox").textContent = formatted;
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

function sendXMLFHIR() {
  const index = document.getElementById("xmlSelect").value;
  ws.send(JSON.stringify({ action: "send-xml-fhir", index }));
}

function updateHL7Preview() {
  const index = document.getElementById("hl7Select").value;
  ws.send(JSON.stringify({ action: "preview-hl7", index }));
}

function updateFHIRPreview() {
  const index = document.getElementById("fhirSelect").value;
  ws.send(JSON.stringify({ action: "preview-fhir", index }));
}

function updateFHIRXMLPreview() {
  const index = document.getElementById("xmlSelect").value;
  ws.send(JSON.stringify({ action: "preview-fhir-xml", index }));
}

function previewHL7Route() {
  const index = document.getElementById("hl7Select").value;
  ws.send(JSON.stringify({ action: "preview-route-hl7", index }));
}

function runHL7Route() {
  const index = document.getElementById("hl7Select").value;
  const destination = document.getElementById("destinationSelect").value;
  ws.send(JSON.stringify({ 
    action: "run-route-hl7",
    index, 
    destination
  }));
}

function previewFHIRRoute() {
  const index = document.getElementById("fhirSelect").value;
  ws.send(JSON.stringify({ action: "preview-route-fhir", index }));
}

function runFHIRRoute() {
  const index = document.getElementById("fhirSelect").value;
  const destination = document.getElementById("destinationSelect").value;
  ws.send(JSON.stringify({
    action: "run-route-fhir",
    index,
    destination
  }));
}




