import styles from "../styles/SearchBar.module.css";
import util from "../Util";
export default function SongItem({ cover, name, artist, url }) {
  return (
    <div>
      <div
        className={"flex flex-row p-2 mt-2 gap-2 " + styles["song-item-mini"]}
        style={{ width: "100%", height: "80px", color: "black" }}
      >
        <div className={styles["song-item-cover"]}>
          <img
            src={cover}
            alt={util.truncate(name, 40)}
            height="50px"
            width="50px"
          />
        </div>
        <div>
          <div className="text-base font-bold">{util.truncate(name, 40)}</div>
          <div className="text-sm font-semibold">
            {util.truncate(artist, 40)}
          </div>
        </div>
        <div
          className={styles["play-button"]}
          onClick={async () => {
            document.getElementById("search-result-holder").classList.add("hidden");
            const song = await window.wrapper.getInfo(url);
            const stream = await window.wrapper.getStream(
              song.streams.progressive
            );
            window.wrapper.play(
              stream,
              { name, artist, cover },
              {
                sampleRate: 48000,
                customArg: ["apulsator=hz=0.09"],
              }
            );
          }}
        >
          <svg
            height="16"
            role="img"
            width="16"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <polygon
              points="21.57 12 5.98 3 5.98 21 21.57 12"
              fill="currentColor"
            ></polygon>
          </svg>
        </div>
      </div>
    </div>
  );
}
