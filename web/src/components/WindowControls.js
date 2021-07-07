import styles from "../styles/WindowControls.module.css";
export default function WindowControls() {
  return (
    <div>
      <div className={styles.titlebar}>
        <div className="py-2 left-0 absolute w-4/5 h-full electron-drag text-center">
          <div className="ml-20 font-semibold">{"Audio Cloud"}</div>
        </div>
        <div
          className={
            "right-0 absolute grid grid-cols-3 grid-flow-col " +
            styles.controlarea
          }
        >
          <div id="min-btn" className={styles["window-controls-holder"]}>
            <img src="./icons/min-w-20.png" alt="minimize" />
          </div>
          <div id="res-max-btn" className={styles["window-controls-holder"]}>
            <img src="./icons/max-w-20.png" alt="maximize" />
          </div>
          <div id="close-btn" className={styles["window-controls-holder"]}>
            <img src="./icons/close-w-20.png" alt="close" />
          </div>
        </div>
      </div>
    </div>
  );
}
