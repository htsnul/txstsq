class Parser {
  constructor() {
    this._smf = new Smf();
    this._track = null;
    this._time = 0;
    this._channelNumber = 0;
  }
  parse(json) {
    const rootObj = JSON.parse(json);
    for (let cmdObj of rootObj) {
      switch (cmdObj[0]) {
        case "//":
          break;
        case "Track":
          this._executeTrackCommand(cmdObj);
          break;
        case "Channel":
          this._executeChannelCommand(cmdObj);
          break;
        case "Step":
          this._executeStepCommand(cmdObj);
          break;
        case "ProgramChange":
          this._executeProgramChangeCommand(cmdObj);
          break;
        case "Note":
          this._executeNoteCommand(cmdObj);
          break;
      }
    }
    this._addEndOfTrackEventIfNeeded();
    return this._smf;
  }
  _executeTrackCommand(cmdObj) {
    this._addEndOfTrackEventIfNeeded();
    this._track = this._smf.addTrack();
    this._time = 0;
    this._channelNumber = 0;
  }
  _executeChannelCommand(cmdObj) {
    const number = parseInt(cmdObj[1]);
    this._channelNumber = number;
  }
  _executeStepCommand(cmdObj) {
    this._time += parseInt(cmdObj[1]);
  }
  _executeProgramChangeCommand(cmdObj) {
    const status = 0xc0 + this._channelNumber;
    const number = parseInt(cmdObj[1]);
    this._track.addEvent(new Event(this._time, [status, number]));
  }
  _executeNoteCommand(cmdObj) {
    const noteNumbers = this._getNoteNumbers(cmdObj[1]);
    const gateTime = (() => {
      if (cmdObj[2] && cmdObj[2]["GateTime"]) {
        return parseInt(cmdObj[2]["GateTime"]);
      }
      return 0;
    })();
    const velocity = (() => {
      if (cmdObj[2] && cmdObj[2]["Velocity"]) {
        return parseInt(cmdObj[2]["Velocity"]);
      }
      return 0;
    })();
    noteNumbers.forEach(noteNumber => {
      const statusOn = 0x90 + this._channelNumber;
      const statusOff = 0x80 + this._channelNumber;
      this._track.addEvent(new Event(this._time, [statusOn, noteNumber, velocity]));
      this._track.addEvent(new Event(this._time + gateTime, [statusOff, noteNumber, velocity]));
    });
  }
  _getNoteNumbers(arg) {
    if (typeof arg === 'number') {
      return [arg];
    }
    if (typeof arg === 'string') {
      const str = arg;
      if (str.length >= 3) {
        const letter = str[0];
        const octave = parseInt(str[2])
        const letterToOffsetTable = { 'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11 };
        const baseNoteNumber = (octave + 1) * 12 + letterToOffsetTable[letter];
        // example: "C 3"
        if (str.length === 3) {
          return [baseNoteNumber];
        }
        // example: "C 3|x| | | |x|"
        else if (str.length >= 4 && str.length % 2 == 0) {
          const noteNum = (str.length - 4) / 2;
          for (let i = 0; i < noteNum + 1; ++i) {
            // Check division symbol.
            if (str[3 + 2 * i] !== '|') {
              return;
            }
          }
          const noteNumbers = [];
          for (let i = 0; i < noteNum; ++i) {
            if (str[4 + 2 * i] === 'x') {
              noteNumbers.push(baseNoteNumber + i);
            }
          }
          return noteNumbers;
        }
      }
    }
  }
  _addEndOfTrackEventIfNeeded() {
    if (this._track) {
      this._track.addEndOfTrackEvent(this._time);
    }
  }
}

