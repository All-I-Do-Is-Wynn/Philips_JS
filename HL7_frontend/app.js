window.addEventListener("load", () => {
  console.log("Creating WebSocket…");
  const ws = new WebSocket("ws://10.0.0.2:8081");

  ws.onopen = () => console.log("WS OPEN");
  ws.onerror = (err) => console.log("WS ERROR", err);
  ws.onclose = () => console.log("WS CLOSED");

  ws.onmessage = (event) => {
    console.log("RAW WS MESSAGE:", event.data);
    const msg = JSON.parse(event.data);

    if (msg.type === "logs") {
      document.getElementById("terminal").textContent = msg.data.join("\n");
    }

    if (msg.type === "preview") {
      const formatted = typeof msg.data === "string"
        ? msg.data.replace(/\r/g, "\n")
        : msg.data;

      document.getElementById("previewBox").textContent = formatted;
    }
  };

  // expose ws globally if needed
  window.ws = ws;
});

console.log("APP.JS LOADED at", Date.now());
window.addEventListener("load", () => {
  console.log("WINDOW LOADED at", Date.now());
});

console.log("APP.JS VERSION 9999");
ws.onopen = () => console.log("WS OPEN");
ws.onerror = (err) => console.log("WS ERROR", err);
ws.onclose = () => console.log("WS CLOSED");


ws.onmessage = (event) => {
    console.log("RAW WS MESSAGE:");

  const msg = JSON.parse(event.data);

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


