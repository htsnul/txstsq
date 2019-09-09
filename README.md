# txstsq
Text Step Sequencer.

My goal is

* Generate midi file from graphically understandable text file

You can create a midi file from the following text.

```
[
  ["Track"],
  ["Channel", 0],
  ["ProgramChange", 4],
  ["Step", 96],
  ["//", "0: 0"],
  ["Note", "C 4|x| | | | | | | | | |", { "GateTime":  96, "Velocity": 64 }], ["Step",  96],
  ["Note", "C 4|x| | | | | | | | | |", { "GateTime":  96, "Velocity": 64 }], ["Step",  96],
  ["Note", "C 4| | | | | | | |x| | |", { "GateTime":  96, "Velocity": 64 }], ["Step",  96],
  ["Note", "C 4| | | | | | | |x| | |", { "GateTime":  96, "Velocity": 64 }], ["Step",  96],
  ["//", "0: 1"],
  ["Note", "C 4| | | | | | | | | |x|", { "GateTime":  96, "Velocity": 64 }], ["Step",  96],
  ["Note", "C 4| | | | | | | | | |x|", { "GateTime":  96, "Velocity": 64 }], ["Step",  96],
  ["Note", "C 4| | | | | | | |x| | |", { "GateTime": 192, "Velocity": 64 }], ["Step",  96],
  ["Note", "C 4| | | | | | | | | | |", { "GateTime":   0, "Velocity": 64 }], ["Step",  96],
  ["Step", 96],
  ["Track"],
  ["Channel", 1],
  ["ProgramChange", 4],
  ["Step", 96],
  ["//", "1: 0"],
  ["Note", "C 3|x| | | |x| | |x| | |", { "GateTime": 192, "Velocity": 64 }], ["Step",  96],
  ["Note", "C 3| | | | | | | | | | |", { "GateTime": 192, "Velocity": 64 }], ["Step",  96],
  ["Note", "C 3|x| | | |x| | |x| | |", { "GateTime": 192, "Velocity": 64 }], ["Step",  96],
  ["Note", "C 3| | | | | | | | | | |", { "GateTime": 192, "Velocity": 64 }], ["Step",  96],
  ["//", "1: 1"],
  ["Note", "C 3|x| | | | |x| | | |x|", { "GateTime": 192, "Velocity": 64 }], ["Step",  96],
  ["Note", "C 3| | | | | | | | | | |", { "GateTime": 192, "Velocity": 64 }], ["Step",  96],
  ["Note", "C 3|x| | | |x| | |x| | |", { "GateTime": 192, "Velocity": 64 }], ["Step",  96],
  ["Note", "C 3| | | | | | | | | | |", { "GateTime": 192, "Velocity": 64 }], ["Step",  96],
  ["//"]
]
```
