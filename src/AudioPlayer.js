const { EventEmitter } = require("events");
const { spawn } = require("child_process");
const Speaker = require("speaker");
const ffmpeg = require("ffmpeg-static");
class AudioPlayer extends EventEmitter {
  constructor() {
    super();
  }
  resume() {
    if (!this.stream) return { data: { error: true, trace: "NO_PLAYING" } };
    if (!this.isPaused) return { data: { error: true, trace: "ALR_PLAYING" } };
    this.speaker = new Speaker({
      channels: 2,
      sampleRate: this.rate,
      bitDepth: 16,
    });
    this.isPaused = false;
    this.stream.pipe(this.speaker);
    return true;
  }
  pause() {
    if (!this.stream) return { data: { error: true, trace: "NO_PLAYING" } };
    if (this.isPaused) return { data: { error: true, trace: "ALR_PAUSED" } };
    this.stream.pause();
    this.speaker.end();
    this.isPaused = true;
    return true;
  }
  startStream(
    stream,
    data = {
      rate: 44000,
    },
    filters = []
  ) {
    if (this.playing) this.speaker.end();
    this.rate = data.rate;
    this.filters = filters;
    this.speaker = new Speaker({
      channels: 2,
      bitDepth: 16,
      sampleRate: data.rate,
    });
    let arr = ["-i", stream, "-f", "s16le", "-ac", "2"];
    if (filters && filters.length) arr = arr.concat(["-af", filters.join(",")]);
    arr.push("pipe:1");
    const out = spawn(ffmpeg, arr);
    out.stdout.pipe(this.speaker);
    this.stream = out.stdout;
    this.speaker.on("finish", () => {
      if (this.isPaused) this.emit("stream-paused");
      else this.emit("stream-end");
    });
    return this.speaker;
  }
}

module.exports = AudioPlayer;
