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
      this._executeCommand(cmdObj);
    }
    this._addEndOfTrackEventIfNeeded();
    return this._smf;
  }
  _executeCommand(cmdObj) {
    if (cmdObj[0] === '//') {
      return;
    };
    const execCmdFunc = this[`_execute${cmdObj[0]}Command`];
    if (!execCmdFunc) {
      throw SyntaxError(cmdObj[0]);
    }
    execCmdFunc.bind(this)(cmdObj);
  }
  _executeAnimateCommand(cmdObj) {
    const command = cmdObj[1];
    const valueStart = cmdObj[2];
    const valueEnd = cmdObj[3];
    const deltaTime = cmdObj[4];
    const stepTime = cmdObj[5] ? cmdObj[5] : 1;
    const lastTime = this._time;
    for (let dt = 0; dt < deltaTime; dt += stepTime) {
      this._time = lastTime + dt;
      const value = Math.round(valueStart + (valueEnd - valueStart) * dt / deltaTime);
      this._executeCommand([command, value]);
    }
    this._time = lastTime + deltaTime;
    this._executeCommand([command, valueEnd]);
    this._time = lastTime;
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
  _executePitchBendSensitivityCommand(cmdObj) {
    this._track.addEvents(
      Event.createPitchBendSensitivityEvents(this._time, this._channelNumber, cmdObj[1])
    );
  }
  _executeProgramChangeCommand(cmdObj) {
    const status = 0xc0 + this._channelNumber;
    const number = cmdObj[1];
    this._track.addEvent(new Event(this._time, [status, number]));
  }
  _executeNoteCommand(cmdObj) {
    const noteNumbers = this._getNoteNumbers(cmdObj[1]);
    const velocity = cmdObj[2];
    const offsetTimeOff = cmdObj[3];
    const offsetTimeOn = cmdObj[4] ? cmdObj[4] : 0;
    const statusOn = 0x90 + this._channelNumber;
    const statusOff = 0x80 + this._channelNumber;
    noteNumbers.forEach(noteNumber => {
      const number = noteNumber.number;
      if (noteNumber.on) {
        this._track.addEvent(new Event(this._time + offsetTimeOn, [statusOn, number, velocity]));
      }
      if (noteNumber.off) {
        this._track.addEvent(new Event(this._time + offsetTimeOff, [statusOff, number, velocity]));
      }
    });
  }
  _executePitchBendChangeCommand(cmdObj) {
    this._track.addEvent(Event.createPitchBendChangeEvent(this._time, this._channelNumber, cmdObj[1]));
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
      return [{ number: arg, on: true, off: true }];
    }
    if (typeof arg === 'string') {
      const str = arg;
      if (2 <= str.length && str.length <= 3) {
        return [{ number: this._getNoteNumber(str), on: true, off: true }];
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
          const symbol = items[2 + i];
          let on = false;
          let off = false;
          if (symbol === 'x') {
            on = true;
            off = true;
          } else if (symbol === 'v') {
            on = true;
          } else if (symbol === '-') {
            off = true;
          }
          if (on || off) {
            noteNumbers.push({ number: baseNoteNumber + i, on, off });
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
    const sharpOrFlatOffset = (str[1] === '#' ? 1 : 0) + (str[1] === 'b' ? -1 : 0);
    const letterToOffsetTable = { 'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11 };
    return (octave + 1) * 12 + letterToOffsetTable[letter] + sharpOrFlatOffset;
  }
  _addEndOfTrackEventIfNeeded() {
    if (this._track) {
      this._track.addEndOfTrackEvent();
    }
  }
}

