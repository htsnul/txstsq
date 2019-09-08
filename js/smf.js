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
    this._events.push(event);
  }
  addEndOfTrackEvent(time) {
    this.addEvent(new Event(time, [0xff, 0x2f, 0x00]));
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
    data.push((remainder > 0 ? 0x80 : 0) + quotient);
  }
  return data;
}

