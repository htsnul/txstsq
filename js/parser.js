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
        case "ControlChange":
          this._executeControlChangeCommand(cmdObj);
          break;
        case "ChannelVolume":
          this._executeChannelVolumeCommand(cmdObj);
          break;
        case "Pan":
          this._executePanCommand(cmdObj);
          break;
        case "Expression":
          this._executeExpressionCommand(cmdObj);
          break;
        case "ProgramChange":
          this._executeProgramChangeCommand(cmdObj);
          break;
        case "Note":
          this._executeNoteCommand(cmdObj);
          break;
        case "GMSystemOn":
          this._executeGMSystemOnCommand(cmdObj);
          break;
        case "MasterVolume":
          this._executeMasterVolumeCommand(cmdObj);
          break;
        case "SetTempo":
          this._executeSetTempoCommand(cmdObj);
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
    this._time += cmdObj[1];
  }
  _executeControlChangeCommand(cmdObj) {
    const status = 0xb0 + this._channelNumber;
    const number = cmdObj[1];
    const value = cmdObj[2];
    this._track.addEvent(new Event(this._time, [status, number, value]));
  }
  _executeChannelVolumeCommand(cmdObj) {
    const status = 0xb0 + this._channelNumber;
    const number = 0x07;
    const value = cmdObj[1];
    this._track.addEvent(new Event(this._time, [status, number, value]));
  }
  _executePanCommand(cmdObj) {
    const status = 0xb0 + this._channelNumber;
    const number = 0x0a;
    const value = 64 + cmdObj[1];
    this._track.addEvent(new Event(this._time, [status, number, value]));
  }
  _executeExpressionCommand(cmdObj) {
    const status = 0xb0 + this._channelNumber;
    const number = 0x0b;
    const value = cmdObj[1];
    this._track.addEvent(new Event(this._time, [status, number, value]));
  }
  _executeProgramChangeCommand(cmdObj) {
    const status = 0xc0 + this._channelNumber;
    const number = cmdObj[1];
    this._track.addEvent(new Event(this._time, [status, number]));
  }
  _executeNoteCommand(cmdObj) {
    const noteNumbers = this._getNoteNumbers(cmdObj[1]);
    const velocity = cmdObj[2];
    const offsetTimeOn = cmdObj[3];
    const offsetTimeOff = cmdObj[4];
    noteNumbers.forEach(noteNumber => {
      const statusOn = 0x90 + this._channelNumber;
      const statusOff = 0x80 + this._channelNumber;
      this._track.addEvent(new Event(this._time + offsetTimeOn, [statusOn, noteNumber, velocity]));
      this._track.addEvent(new Event(this._time + offsetTimeOff, [statusOff, noteNumber, velocity]));
    });
  }
  _executeGMSystemOnCommand(cmdObj) {
    this._track.addEvent(Event.createGMSystemOnEvent(this._time, cmdObj[1], cmdObj[2]));
  }
  _executeMasterVolumeCommand(cmdObj) {
    this._track.addEvent(Event.createMasterVolumeEvent(this._time, cmdObj[1]));
  }
  _executeSetTempoCommand(cmdObj) {
    this._track.addEvent(Event.createSetTempoEvent(this._time, cmdObj[1]));
  }
  _getNoteNumbers(arg) {
    if (typeof arg === 'number') {
      return [arg];
    }
    if (typeof arg === 'string') {
      const str = arg;
      if (2 <= str.length && str.length <= 3) {
        return [this._getNoteNumber(str)];
      }
      // example: "|C 3|x| | | |x|"
      else if (str[0] === "|") {
        const items = str.split('|').map(s => s.trim());
        if (items[0] !== '' || items[items.length - 1] !== '') {
          return;
        }
        const baseNoteNumber = this._getNoteNumber(items[1]);
        const noteNum = items.length - 3;
        const noteNumbers = [];
        for (let i = 0; i < noteNum; ++i) {
          if (items[2 + i] === 'x') {
            noteNumbers.push(baseNoteNumber + i);
          }
        }
        return noteNumbers;
      }
    }
  }
  // Example: "C4" -> 60
  _getNoteNumber(str) {
    const letter = str[0];
    const octave = parseInt(str[str.length - 1]);
    const letterToOffsetTable = { 'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11 };
    return (octave + 1) * 12 + letterToOffsetTable[letter];
  }
  _addEndOfTrackEventIfNeeded() {
    if (this._track) {
      this._track.addEndOfTrackEvent(this._time);
    }
  }
}

