const SoundCloud = require("soundcloud-scraper");
const SoundCloudClient = new SoundCloud.Client();
const AudioPlayer = require("./AudioPlayer");
const Player = new AudioPlayer();
const { contextBridge, ipcRenderer } = require("electron");
const moment = require("moment");
require("moment-duration-format")(moment);
contextBridge.exposeInMainWorld("platform", process.platform);
const { Store } = require("./store");
const store = new Store();
const wrapper = {
  async search(q, type = "track") {
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
  getPresets() {
    return store.getPresets();
  },
  setPresets(data) {
    ipcRenderer.invoke(
      "show-dialog",
      "Your Filter will apply after this track"
    );
    return store.setPresets(data);
  },
  showDialog(message) {
    ipcRenderer.invoke("show-dialog", message);
  },
  async play(
    stream,
    meta = {
      name: null,
      artist: null,
      cover: null,
    },
    presets = {
      bass: parseInt(store.getPresets().bass) || 0,
      sampleRate: parseInt(store.getPresets().rate) || 44000,
      customArg: [],
    }
  ) {
    let f = [];
    if (presets.customArg.length) f = f.concat(presets.customArg);
    if (presets.bass && typeof presets.bass == "number")
      f = f.concat(["bass=g=" + presets.bass]);
    Player.startStream(stream, { rate: presets.sampleRate }, f);
    ipcRenderer.invoke("set-rpc", { name: meta.name, artist: meta.artist });
    document.getElementById("current_song_title").textContent =
      meta.name.truncate(20);
    document.getElementById("current_song_footer").textContent =
      meta.artist.truncate(25);
    document.getElementById(
      "current_song_image"
    ).style.backgroundImage = `url("${meta.cover}")`;
  },
};
SoundCloudClient.createAPIKey().then(async () => {
  contextBridge.exposeInMainWorld("scKey", SoundCloudClient.API_KEY);
  contextBridge.exposeInMainWorld("wrapper", wrapper);
});
document.addEventListener("DOMContentLoaded", async () => {
  handleSub();
  document.getElementById("sample-rate-preset").value =
    wrapper.getPresets().rate;
  document.getElementById("bass-preset").value = wrapper.getPresets().bass;
  Player.on("time-get", (t) => {
    document.getElementById("total").textContent = moment
      .duration(t, "seconds")
      .format("hh:mm:ss");
  });
  Player.on("stream-paused", () => {
    ipcRenderer.invoke("remove-rpc");
  });
  Player.on("stream-end", () => {
    ipcRenderer.invoke("remove-rpc");
  });
  Player.on("stream-start", () => {
    requestAnimationFrame(updateBar);
    function updateBar() {
      const width = document.getElementById("song-progress").offsetWidth;
      let elap = Math.abs(Date.now() - Player.startedAt - Player.pausedTime);
      document.getElementById("elapsed").textContent = moment
        .utc(elap)
        .format("hh:mm:ss")
        .replace("12:", "");
      let total = Player.dur * 1000;
      let perct = (elap / total) * width;
      if (elap / total > 1) return;
      document.getElementById("song-progress-track").style.width = `${perct}px`;
      if (!Player.isPaused && Player.playing)
        return requestAnimationFrame(updateBar);
    }
  });

  document.getElementById("pause-resume-btn").addEventListener("click", () => {
    const resume = `<svg role="img" height="16" width="16" viewBox="0 0 16 16" ><path d="M4.018 14L14.41 8 4.018 2z"></path></svg>`;
    const pause = `<svg role="img" height="16" width="16" viewBox="0 0 16 16">
    <path fill="none" d="M0 0h16v16H0z"></path>
    <path d="M3 2h3v12H3zm7 0h3v12h-3z"></path>
  </svg>`;
    if (!Player.speaker) return;
    if (Player.isPaused) {
      document.getElementById("pause-resume-btn").innerHTML = pause;
      Player.resume();
    } else {
      Player.pause();
      document.getElementById("pause-resume-btn").innerHTML = resume;
    }
  });
});

function subscribeWindowControls() {
  document.getElementById("close-btn").addEventListener("click", () => {
    Player.speaker ? Player.speaker.destroy() : null;
    ipcRenderer.invoke("close-pressed");
  });
  document.getElementById("res-max-btn").addEventListener("click", () => {
    ipcRenderer.invoke("res-max-pressed");
  });
  document.getElementById("min-btn").addEventListener("click", () => {
    ipcRenderer.invoke("min-pressed");
  });
}
const handleSub = () => {
  try {
    subscribeWindowControls();
  } catch (e) {
    setTimeout(() => {
      handleSub();
    }, 500);
  }
};

String.prototype.truncate = function (n) {
  return this.length > n ? this.substr(0, n - 1) + "..." : this;
};
