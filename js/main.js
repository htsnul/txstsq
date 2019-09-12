const templateCode = `[
  ["Track"],
  ["GMSystemOn"],
  ["SetTempo", 100],
  ["MasterVolume", 16383],
  ["//", "Channel 0"],
  ["Track"], ["Channel", 0], ["ProgramChange", 4],
  ["ChannelVolume", 127],
  ["Pan", 32],
  ["Step", 96],
  ["//", "0: 0"],
  ["PitchBendSensitivity", 12],
  ["Animate", "PitchBendChange", -8192, 0, 24],
  ["Note", "|C 4|x| | | | | | | | | |", 64, 0, 96], ["Step",  96],
  ["Note", "|C 4|x| | | | | | | | | |", 64, 0, 96], ["Step",  96],
  ["Note", "|C 4| | | | | | | |x| | |", 64, 0, 96], ["Step",  96],
  ["Note", "|C 4| | | | | | | |x| | |", 64, 0, 96], ["Step",  96],
  ["//", "0: 1"],
  ["Note", "|C 4| | | | | | | | | |x|", 64, 0, 96], ["Step",  96],
  ["Note", "|C 4| | | | | | | | | |x|", 64, 0, 96], ["Step",  96],
  ["Note", "|C 4| | | | | | | |x| | |", 64, 0, 96], ["Step",  96],
  ["Note", "|C 4| | | | | | | | | | |", 64, 0, 96], ["Step",  96],
  ["//", "Channel 1"],
  ["Track"], ["Channel", 1], ["ProgramChange", 4],
  ["ChannelVolume", 127],
  ["Pan", -32],
  ["Step", 96],
  ["//", "1: 0"],
  ["Note", "|C 3|x| | | |x| | |x| | |", 64, 0, 192], ["Step",  96],
  ["Note", "|C 3| | | | | | | | | | |",  0, 0,   0], ["Step",  96],
  ["Note", "|C 3|x| | | |x| | |x| | |", 64, 0, 192], ["Step",  96],
  ["Note", "|C 3| | | | | | | | | | |",  0, 0,   0], ["Step",  96],
  ["//", "1: 1"],
  ["Note", "|C 3|x| | | | |x| | | |x|", 64, 0, 192], ["Step",  96],
  ["Note", "|C 3| | | | | | | | | | |",  0, 0,   0], ["Step",  96],
  ["Note", "|C 3|x| | | |x| | |x| | |", 64, 0, 192], ["Step",  96],
  ["Note", "|C 3| | | | | | | | | | |",  0, 0,   0], ["Step",  96],
  ["//"]
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
    const a = document.querySelector('.download-a');
    a.download = 'output.mid';
    a.href = fileReader.result;
    a.innerHTML = a.download;
    // Firefox cannot download from not-appended element.
    document.querySelector('.menu-div').append(a);
    a.click();
  }
  fileReader.readAsDataURL(blob);
}

