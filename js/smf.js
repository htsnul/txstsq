class Smf {
  constructor() {
    // division, ticks per quarter-note
    // * The default value of 96 is derived from
    //     * Standard Midi Files 1.0 example
    //     * QX3 default
    this._division = 96;
    this._tracks = [];
  }
  set division(division) {
    this._division = division;
  }
  addTrack() {
    const track = new Track();
    this._tracks.push(track);
    return track;
  }
  toBytes() {
    const buf = [];
    // Header Chunk
    {
      buf.push(...Array.from('MThd').map(c => c.charCodeAt(0)));
      // length
      buf.push(...uintToBigEndianBytes(4, 6));
      // format
      buf.push(...uintToBigEndianBytes(2, 1));
      // number of track chunks
      buf.push(...uintToBigEndianBytes(2, this._tracks.length));
      // division, ticks per quarter-note
      buf.push(...uintToBigEndianBytes(2, this._division));
    }
    // Track Chunks
    for (const track of this._tracks) {
      buf.push(...track.toBytes());
    }
    return buf;
  }
}

class Track {
  constructor() {
    this._events = [];
  }
  addEvent(event) {
    let i = this._events.length - 1;
    while (i > 0 && this._events[i].time > event.time) {
      i--;
    }
    this._events.splice(i + 1, 0, event);
  }
  addEvents(events) {
    events.forEach(e => this.addEvent(e));
  }
  addEndOfTrackEvent() {
    let time = 0;
    // Always add at the end.
    if (this._events.length) {
      time = this._events[this._events.length - 1].time;
    }
    this.addEvent(Event.createEndOfTrackEvent(time));
  }
  toBytes() {
    const buf = [];
    buf.push(...Array.from('MTrk').map(c => c.charCodeAt(0)));
    const eventsBytes = this._getEventsBytes();
    buf.push(...uintToBigEndianBytes(4, eventsBytes.length));
    buf.push(...eventsBytes);
    return buf;
  }
  _getEventsBytes() {
    const buf = [];
    let time = 0;
    this._events.forEach(event => {
      buf.push(...event.toBytes(time));
      time = event.time;
    });
    return buf;
  }
};

class Event {
  constructor(time, data) {
    this._time = time;
    this._data = data;
  }
  static createPitchBendSensitivityEvents(time, channel, value) {
    const status = 0xb0 + channel;
    return [
      new Event(time, [status, 101, 0]),
      new Event(time, [status, 100, 0]),
      new Event(time, [status, 6, value])
    ];
  }
  static createPitchBendChangeEvent(time, channel, value) {
    const status = 0xe0 + channel;
    return new Event(time, [status, ...int14toTwoDataBytes(value)]);
  }
  static createGMSystemOnEvent(time) {
    return new Event(time, [0xf0, 5, 0x7e, 0x7f, 9, 1, 0xf7]);
  }
  static createMasterVolumeEvent(time, volume) {
    return new Event(time, [0xf0, 7, 0x7f, 0x7f, 4, 1, ...uint14toTwoDataBytes(volume), 0xf7]);
  }
  static createSetTempoEvent(time, tempo) {
    return new Event(time, [0xff, 0x51, 3, ...uintToBigEndianBytes(3, 60 * 1000 * 1000 / tempo)]);
  }
  static createEndOfTrackEvent(time) {
    return new Event(time, [0xff, 0x2f, 0]);
  }
  get time() {
    return this._time;
  }
  toBytes(time) {
    return [...deltaTimeToBytes(this._time - time), ...this._data];
  }
}

function uintToBigEndianBytes(bytes, value) {
  let data = [];
  let remainder = value;
  for (let i = bytes - 1; i >= 0; --i) {
    const divisor = Math.pow(0x100, i);
    const quotient = Math.floor(remainder / divisor);
    remainder -= quotient * divisor;
    data.push(quotient);
  }
  return data;
}

function deltaTimeToBytes(deltaTime) {
  let data = [];
  let remainder = deltaTime;
  for (let i = 3; i >= 0; --i) {
    const divisor = Math.pow(0x80, i);
    const quotient = Math.floor(remainder / divisor);
    if (quotient === 0 && i > 0) {
      continue;
    }
    remainder -= quotient * divisor;
    data.push((i > 0 ? 0x80 : 0) + quotient);
  }
  return data;
}

function uint14toTwoDataBytes(value) {
  if (!(0 <= value && value <= 16383)) {
    throw new RangeError(value);
  }
  return [value % 128, Math.floor(value / 128)];
}

function int14toTwoDataBytes(value) {
  if (!(-8192 <= value && value <= 8191)) {
    throw new RangeError(value);
  }
  return uint14toTwoDataBytes(8192 + value);
}
