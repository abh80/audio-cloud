import styles from "../styles/SearchBar.module.css";
import React, { useEffect } from "react";
import SongItem from "./miniSongItem";
export default function SearchBar() {
  const [songs, setSongs] = React.useState([]);
  useEffect(() => {
    window.onclick = (e) => {
      if (
        document.elementFromPoint(e.clientX, e.clientY).id ===
          "search-result-holder" ||
        document
          .elementFromPoint(e.clientX, e.clientY)
          .classList.contains(styles["song-item-mini"]) ||
        e.target.parentElement.classList.contains(styles["song-item-mini"]) ||
        e.target.parentElement.parentElement.classList.contains(
          styles["song-item-mini"]
        )
      ) {
        return;
      }
      if (
        !document
          .getElementById("search-result-holder")
          .classList.contains("hidden")
      )
        document.getElementById("search-result-holder").classList.add("hidden");
    };
  }, []);
  return (
    <div style={{ marginBottom: "10px" }}>
      <div className={styles["search-bar-input"]}>
        <input
          type="text"
          placeholder="Search..."
          autoCorrect="off"
          spellCheck="false"
          onChange={(e) => {
            handleSearch(e, setSongs, songs);
          }}
        />
      </div>
      <div
        id="search-result-holder"
        className={
          "absolute w-1/4 mt-2 hidden " + styles["search-result-holder"]
        }
      >
        {songs.map((song, index) => (
          <SongItem
            key={index}
            name={song.name}
            cover={song.cover}
            artist={song.artist}
            url={song.url}
          />
        ))}
      </div>
    </div>
  );
}
function handleSearch($ev, setSongs, songs) {
  setSongs([]);
  const searchText = $ev.target.value;
  if (searchText.trim() === "") {
    if (
      !document
        .getElementById("search-result-holder")
        .classList.contains("hidden")
    )
      document.getElementById("search-result-holder").classList.add("hidden");
    return;
  }
  if (searchText.length < 3) return;
  window.wrapper.search(searchText).then((x) => {
    x.slice(0, 10).forEach(async (song) => {
      const { title, author, thumbnail } = await window.wrapper.getInfo(
        song.url
      );
      setSongs([
        ...songs,
        { name: title, cover: thumbnail, artist: author.name, url: song.url },
      ]);
    });
  });
  document.getElementById("search-result-holder").classList.remove("hidden");
}
