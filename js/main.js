const templateCode = `[
  ["Track"],
  ["Channel", 0],
  ["Step", 96],
  ["Note", "C4", { "GateTime": 96, "Velocity": 64 }], ["Step", 96],
  ["Note", "C4", { "GateTime": 96, "Velocity": 64 }], ["Step", 96],
  ["Note", "G4", { "GateTime": 96, "Velocity": 64 }], ["Step", 96],
  ["Note", "G4", { "GateTime": 96, "Velocity": 64 }], ["Step", 96],
  ["Note", "A4", { "GateTime": 96, "Velocity": 64 }], ["Step", 96],
  ["Note", "A4", { "GateTime": 96, "Velocity": 64 }], ["Step", 96],
  ["Note", "G4", { "GateTime": 96, "Velocity": 64 }], ["Step", 96],
  ["Step", 96],
  ["Track"],
  ["Channel", 1],
  ["ProgramChange", 10],
  ["Step", 96],
  ["Note", "C3", { "GateTime": 48, "Velocity": 64 }], ["Step", 48],
  ["Note", "G3", { "GateTime": 48, "Velocity": 64 }], ["Step", 48],
  ["Note", "E3", { "GateTime": 48, "Velocity": 64 }], ["Step", 48],
  ["Note", "G3", { "GateTime": 48, "Velocity": 64 }], ["Step", 48],
  ["Note", "C3", { "GateTime": 48, "Velocity": 64 }], ["Step", 48],
  ["Note", "G3", { "GateTime": 48, "Velocity": 64 }], ["Step", 48],
  ["Note", "E3", { "GateTime": 48, "Velocity": 64 }], ["Step", 48],
  ["Note", "G3", { "GateTime": 48, "Velocity": 64 }], ["Step", 48],
  ["Note", "C3", { "GateTime": 48, "Velocity": 64 }], ["Step", 48],
  ["Note", "A3", { "GateTime": 48, "Velocity": 64 }], ["Step", 48],
  ["Note", "F3", { "GateTime": 48, "Velocity": 64 }], ["Step", 48],
  ["Note", "A3", { "GateTime": 48, "Velocity": 64 }], ["Step", 48],
  ["Note", "C3", { "GateTime": 48, "Velocity": 64 }], ["Step", 48],
  ["Note", "G3", { "GateTime": 48, "Velocity": 64 }], ["Step", 48],
  ["Note", "E3", { "GateTime": 48, "Velocity": 64 }], ["Step", 48],
  ["Note", "G3", { "GateTime": 48, "Velocity": 64 }], ["Step", 48]
]
`;

onload = () => {
  document.querySelector('.parse-and-download-button').onclick = onParseAndDownloadButtonClick;
  document.querySelector('.code-textarea').value = templateCode;
}

function onParseAndDownloadButtonClick() {
  document.querySelector('.output-textarea').innerHTML = '';
  const parser = new Parser();
  let smf = null;
  try {
    smf = parser.parse(document.querySelector('.code-textarea').value);
  } catch(exception) {
    document.querySelector('.output-textarea').innerHTML = exception;
    return;
  }
  document.querySelector('.output-textarea').innerHTML = 'Success';
  const smfBytes = smf.toBytes();
  const uint8Array = new Uint8Array(smfBytes.length);
  uint8Array.set(smfBytes);
  if (0) {
    console.log(Array.from(uint8Array).map(v => v.toString(16)));
  }
  const blob = new Blob([uint8Array.buffer], { type: "audio/midi" });
  const fileReader = new FileReader();
  fileReader.onload = () => {
    const a = document.createElement('a');
    a.download = 'output.mid';
    a.href = fileReader.result;
    a.click();
  }
  fileReader.readAsDataURL(blob);
}

