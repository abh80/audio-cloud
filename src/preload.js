const SoundCloud = require("soundcloud-scraper");
const SoundCloudClient = new SoundCloud.Client();
const fs = require("fs");
const Speaker = require("speaker");

const { contextBridge, ipcRenderer } = require("electron");
const { spawn } = require("child_process");
const wrapper = {
  async search(q, type = "all") {
    return await SoundCloudClient.search(q, type);
  },
  async getInfo(url) {
    return await SoundCloudClient.getSongInfo(url);
  },
  async getStream(url) {
    return await SoundCloud.Util.fetchSongStreamURL(
      url,
      SoundCloudClient.API_KEY
    );
  },
};

document.addEventListener("DOMContentLoaded", async () => {
  //subscribeWindowControls();

  SoundCloudClient.createAPIKey().then(async () => {
    contextBridge.exposeInMainWorld("scKey", SoundCloudClient.API_KEY);
    contextBridge.exposeInMainWorld("wrapper", wrapper);
    const moosic = await wrapper.getInfo(
      "https://soundcloud.com/bestcoversss/china-anuel-aa-daddy-yankee-karol-g-ozuna-j-balvin-conor-maynard-anth-cover"
    );

    const stream = await wrapper.getStream(moosic.streams.progressive);
    const speaker = startStream(stream, { rate: 48000 }, ["bass=g=5", "dynaudnorm"]);

  });
});

function subscribeWindowControls() {
  document.getElementById("close-btn").addEventListener("click", () => {
    ipcRenderer.invoke("close-pressed");
  });
  document.getElementById("res-max-btn").addEventListener("click", () => {
    ipcRenderer.invoke("res-max-pressed");
  });
  document.getElementById("min-btn").addEventListener("click", () => {
    ipcRenderer.invoke("min-pressed");
  });
}

function startStream(
  stream,
  data = {
    rate: 44000,
  },
  filters = []
) {
  this.speaker = new Speaker({
    channels: 2,
    bitDepth: 16,
    sampleRate: data.rate,
  });
  const arr = [
    "-i",
    stream,
    "-af",
    filters.join(","),
    "-f",
    "s16le",
    "-ac",
    "2",
    "pipe:1",
  ];
  const out = spawn("ffmpeg", arr);
  out.stdout.pipe(this.speaker);
  this.speaker.once("close", () => {
    console.log("closed");
  });
  return this.speaker;
}
