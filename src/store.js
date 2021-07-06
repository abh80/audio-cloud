const ElectronStore = require("electron-store");
class Store {
  constructor() {
    this.store = new ElectronStore();
    this.isMaximized = false;
  }

  lastWindowSize() {
    const size = this.store.get("win_size");
    if (!size)
      return {
        width: 800,
        height: 600,
        maximized: this.isMaximized,
      };
    else return size;
  }
  setWindowSize(
    data = {
      x: null,
      y: null,
      width: 800,
      height: 600,
      maximized: this.isMaximized,
    }
  ) {
    this.store.set("win_size", data);
  }
  setMaximized(bool) {
    this.isMaximized = bool;
    const lastState = this.store.get("win_size");
    if (!lastState) {
      this.store.set("win_size", {
        x: null,
        y: null,
        width: 800,
        height: 600,
        maximized: bool,
      });
      return;
    }
    lastState.maximized = bool;
    this.store.set("win_size", lastState);
  }
}
module.exports = {
  Store,
};
