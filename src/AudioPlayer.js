const { EventEmitter } = require("events");
const { spawn } = require("child_process");
const Speaker = require("speaker");
const ffmpeg = require("ffmpeg-static-electron");
const ffprobe = require("ffprobe-static-electron");

class AudioPlayer extends EventEmitter {
  constructor() {
    super();
    this.pausedTime = 0;
  }
  resume() {
    if (!this.stream) return { data: { error: true, trace: "NO_PLAYING" } };
    if (!this.isPaused) return { data: { error: true, trace: "ALR_PLAYING" } };
    this.speaker = new Speaker({
      channels: 2,
      sampleRate: this.rate,
      bitDepth: 16,
    });
    this.subscribeEvents();
    this.pausedTime += Date.now() - this.pausedAt;
    this.isPaused = false;
    this.stream.pipe(this.speaker);
    return true;
  }
  subscribeEvents() {
    this.speaker.on("pipe", () => {
      this.emit("stream-start");
    });
    this.speaker.on("finish", () => {
      if (this.isPaused) return this.emit("stream-paused");
      else this.emit("stream-end");
      this.speaker.close();
      this.closeStream();
      this.playing = false;
      this.stream = null;
      this.speaker = null;
      this.isPaused = false;
      this.pausedAt = null;
      this.pausedTime = 0;
    });
  }
  pause() {
    if (!this.stream) return { data: { error: true, trace: "NO_PLAYING" } };
    if (this.isPaused) return { data: { error: true, trace: "ALR_PAUSED" } };
    this.isPaused = true;
    this.stream.pause();
    this.speaker.end();
    this.pausedAt = Date.now();
    return true;
  }
  closeStream() {
    try {
      this.stream.destroy();
    } catch (e) {}
  }
  stop() {
    if (this.playing && this.speaker) {
      this.speaker.close();
      this.speaker = null;
      this.playing = false;
      this.closeStream();
    }
  }
  async startStream(
    stream,
    data = {
      rate: 44000,
    },
    filters = []
  ) {
    if (this.playing) {
      this.stop();
      this.closeStream();
    }
    this.playing = true;
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
    const out = spawn(
      ffmpeg.path.replace("app.asar", "app.asar.unpacked"),
      arr
    );
    this.speaker.on("pipe", () => {
      this.emit("stream-start");
      this.startedAt = Date.now();
    });
    out.stdout.pipe(this.speaker);
    const dur = await this.getDuration(stream);
    this.stream = out.stdout;
    this.speaker.on("finish", () => {
      if (this.isPaused) return this.emit("stream-paused");
      else this.emit("stream-end");
      this.speaker.close();
      this.closeStream();
      this.playing = false;
      this.stream = null;
      this.speaker = null;
      this.pausedAt = null;
      this.pausedTime = 0;
      this.isPaused = false;
    });
    this.dur = dur;
    return true;
  }
  getDuration(stream) {
    return new Promise((resolve, reject) => {
      let arr = ["-print_format", "json", "-show_format", `\"${stream}\"`];

      const r = spawn(
        ffprobe.path.replace("app.asar", "app.asar.unpacked"),
        arr,
        {
          shell: true,
        }
      );
      let v = "";
      r.stdout.on("data", (d) => {
        v += d.toString();
      });

      r.stdout.on("end", () => {
        v = JSON.parse(v);
        this.emit("time-get", v.format.duration);
        resolve(v.format.duration);
      });
    });
  }
}

module.exports = AudioPlayer;
