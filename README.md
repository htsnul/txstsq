# txstsq
Text Step Sequencer.

My goal is

* Generate midi file from graphically understandable text file

You can create a midi file from the following text.

```
[
  ["//", "Channel 0"],
  ["Track"], ["Channel", 0], ["ProgramChange", 4],
  ["Step", 96],
  ["//", "0: 0"],
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
```
