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
  document.querySelector('.parse-button').onclick = onParseButtonClick;
  document.querySelector('.code-textarea').value = templateCode;
}

function onParseButtonClick() {
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
  console.log(Array.from(uint8Array).map(v => v.toString(16)));
  const file = new File([uint8Array], "test.mid", { type: "audio/midi" });
  const fileReader = new FileReader();
  fileReader.onload = () => {
    const a = document.querySelector('a');
    a.href = fileReader.result;
    a.click();
  }
  fileReader.readAsDataURL(file);
}

