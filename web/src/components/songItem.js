import styles from "../styles/Home.module.css";
import Util from "../Util";
export default function songItem({ name, cover, artist, url }) {
  return (
    <div
      style={{
        width: "200px",
        height: "250px",
        borderRadius: "5px",
      }}
      className={styles.songItem}
    >
      <img src={cover} alt={name + " by " + artist} />
      <div
        className={styles["play-button"]}
        onClick={async () => {
          const song = await window.wrapper.getInfo(url);
          const stream = await window.wrapper.getStream(
            song.streams.progressive
          );
          window.wrapper.play(stream, { name, artist, cover });
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
      <div className="text-base font-bold">{Util.truncate(name, 19)}</div>
      <div className="text-sm font-semibold">{Util.truncate(artist, 19)}</div>
    </div>
  );
}
