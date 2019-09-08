const templateCode = `[
  ["Track"],
  ["Channel", 0],
  ["Step", 96],
  ["Note", 60, { "GateTime": 96, "Velocity": 80 }], ["Step", 96],
  ["Note", 62, { "GateTime": 96, "Velocity": 80 }], ["Step", 96],
  ["Note", 64, { "GateTime": 96, "Velocity": 80 }], ["Step", 96],
  ["Note", 65, { "GateTime": 96, "Velocity": 80 }], ["Step", 96],
  ["Track"],
  ["Channel", 1],
  ["ProgramChange", 10],
  ["Step", 96],
  ["Note", 48, { "GateTime": 96, "Velocity": 80 }], ["Step", 96],
  ["Note", 50, { "GateTime": 96, "Velocity": 80 }], ["Step", 96],
  ["Note", 52, { "GateTime": 96, "Velocity": 80 }], ["Step", 96],
  ["Note", 53, { "GateTime": 96, "Velocity": 80 }], ["Step", 96]
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

