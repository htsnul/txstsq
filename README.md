# txstsq

Text Step Sequencer.

## Overview

Our goal is

* Generate MIDI file from graphically understandable text file

You can create a MIDI file from the following text.

```
[
  ["Track"],
  ["GMSystemOn"],
  ["//", "Right"],
  ["Track"], ["Channel", 0], ["ProgramChange", 4],
  ["Step", 96],
  ["//", "Right: 0"],
  ["Note", "|C 4|x| | | | | | | | | |", 64, 96], ["Step",  96],
  ["Note", "|C 4|x| | | | | | | | | |", 64, 96], ["Step",  96],
  ["Note", "|C 4| | | | | | | |x| | |", 64, 96], ["Step",  96],
  ["Note", "|C 4| | | | | | | |x| | |", 64, 96], ["Step",  96],
  ["//", "Right: 1"],
  ["Note", "|C 4| | | | | | | | | |x|", 64, 96], ["Step",  96],
  ["Note", "|C 4| | | | | | | | | |x|", 64, 96], ["Step",  96],
  ["Note", "|C 4| | | | | | | |v| | |", 64, 96], ["Step",  96],
  ["Note", "|C 4| | | | | | | |-| | |", 64, 96], ["Step",  96],
  ["//", "Left"],
  ["Track"], ["Channel", 1], ["ProgramChange", 4],
  ["Step", 96],
  ["//", "Left: 0"],
  ["Note", "|C 3|v| | | |v| | |v| | |", 64, 96], ["Step",  96],
  ["Note", "|C 3|-| | | |-| | |-| | |", 64, 96], ["Step",  96],
  ["Note", "|C 3|v| | | |v| | |v| | |", 64, 96], ["Step",  96],
  ["Note", "|C 3|-| | | |-| | |-| | |", 64, 96], ["Step",  96],
  ["//", "Left: 1"],
  ["Note", "|C 3|v| | | | |v| | | |v|", 64, 96], ["Step",  96],
  ["Note", "|C 3|-| | | | |-| | | |-|", 64, 96], ["Step",  96],
  ["Note", "|C 3|v| | | |v| | |v| | |", 64, 96], ["Step",  96],
  ["Note", "|C 3|-| | | |-| | |-| | |", 64, 96], ["Step",  96],
  ["//"]
]

```

## Original Command Reference

### Comment

Comment.

```
  ["//"(, <Comment>)],
```

Example:

```
  ["//", "Write a description here."],
```

### Step

Advance current time.

```
  ["Step", <DeltaTime>],
```

Example:

```
  ["Step", 96],
```

### Note

Note on or off.

```
  ["Note", <Note(s)>, <Velocity>, <OffsetTimeOff>(, <OffsetTimeOn>)],
```

* Velocity: 0 - 127
* Symbol in table
  * "x": Note On and Off
  * "v": Note On only
  * "-": Note Off only

Example:

```
  ["Note", "|C 4|v| | | |x| | | |", 64, 96], ["Step",  96],
  ["Note", "|C 4| | | | | | | |x|", 64, 96], ["Step",  96],
  ["Note", "|C 4| | | | |x| | | |", 64, 96], ["Step",  96],
  ["Note", "|C 4|-| | | | | | |x|", 64, 96], ["Step",  96],
```

### Channel

Set current channel.

```
  ["Channel", <Number>],
```

Example:

```
  ["Channel", 3],
```

### Animate

Execute command with continuous change.

```
  ["Animate", <CommandName>, <ValueStart>, <ValueEnd>, <DeltaTime>(, <StepTime>)],
```

Example:

```
  ["Animate", "PitchBendChange", -8192, 0, 96],
```

## MIDI Command Reference

### Track

### ControlChange

### ChannelVolume

### Pan

### Expression

### PitchBendSensitivity

### GMSystemOn

### MasterVolume

### SetTempo


