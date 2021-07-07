const SoundCloud = require("soundcloud-scraper");
const SoundCloudClient = new SoundCloud.Client();
const Player = require("./AudioPlayer");
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("platform", process.platform);

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
  handleSub();
  SoundCloudClient.createAPIKey().then(async () => {
    contextBridge.exposeInMainWorld("scKey", SoundCloudClient.API_KEY);
    contextBridge.exposeInMainWorld("wrapper", wrapper);
    wrapper
      .getInfo("https://soundcloud.com/drewgannon/somesayremix")
      .then((s) => {
        wrapper.getStream(s.streams.progressive).then((u) => {
          new Player().startStream(u, { rate: 48000 }, ["bass=g=20"]);
        });
      });
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
const handleSub = () => {
  try {
    subscribeWindowControls();
  } catch (e) {
    setTimeout(() => {
      handleSub();
    }, 500);
  }
};
