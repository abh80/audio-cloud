import React from "react";
import SongItem from "./components/songItem";
import TitleBarMac from "./components/MacControls";
import styles from "./styles/Home.module.css";
import TitleBarWin from "./components/WindowControls";
import SearchBar from "./components/SearchBar";
import FilterBar from "./components/FilterBar";
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      platform: null,
    };
  }
  componentDidMount() {
    this.setState({ platform: window.platform });
  }
  render() {
    return (
      <div style={{ width: "100%", height: "100%" }}>
        {this.state.platform ? (
          this.state.platform === "win32" ? (
            <TitleBarWin />
          ) : (
            <TitleBarMac />
          )
        ) : (
          <TitleBarMac />
        )}
        <div className="py-10 px-10">
          <SearchBar />
          <div className="ml-2 text-lg font-bold">Songs to try!</div>
          <div className="ml-2" style={{ color: "#adadad" }}>
            These songs are recommended to try by the creator of this app
          </div>
          <div className="overflow-auto" style={{ marginTop: "15px" }}>
            <SongItem
              name="Sleepless Nights"
              artist="Ayokay"
              url="https://soundcloud.com/sumana-mondal-457666143/sleepless-nights-ayokay-feat-nightly"
              cover="https://e-cdns-images.dzcdn.net/images/cover/1a615081bffb8418d983faec7cacadda/264x264-000000-80-0-0.jpg"
            />
          </div>
        </div>
        <FilterBar />
        <div
          className="fixed"
          style={{
            width: "300px",
            bottom: "80px",
            height: "100px",
            overflow: "hidden",
            border: "1px solid rgb(40, 40, 40)",
            transition: "all .3s ease-in-out",
          }}
        >
          <div
            style={{
              height: "20px",
              width: "100%",
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                transform: "rotate(268deg)",
                cursor: "pointer",
                transition: "all .3s ease-in-out",
              }}
              onClick={(e) => {
                if (
                  !document
                    .getElementById("current_song-holder")
                    .classList.contains("hidden")
                ) {
                  e.currentTarget.parentElement.parentElement.style.height =
                    "20px";
                  e.currentTarget.style.transform = "rotate(88deg)";
                  setTimeout(() => {
                    document
                      .getElementById("current_song-holder")
                      .classList.add("hidden");
                  }, 300);
                } else {
                  document
                    .getElementById("current_song-holder")
                    .classList.remove("hidden");
                  e.currentTarget.parentElement.parentElement.style.height =
                    "100px";
                  e.currentTarget.style.transform = "rotate(268deg)";
                }
              }}
            >
              <svg
                fill="white"
                height="20"
                role="img"
                width="24"
                viewBox="0 0 20 20"
              >
                <polygon points="15.54,21.151 5.095,12.229 15.54,3.309 16.19,4.069 6.635,12.229 16.19,20.39 "></polygon>
              </svg>
            </div>
          </div>
          <div id="current_song-holder" className="flex gap-2 w-full">
            <div
              id="current_song_image"
              alt="now-playing"
              style={{
                height: "80px",
                width: "80px",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
              }}
            />

            <div>
              <div id="current_song_title" className="text-lg font-bold"></div>
              <div
                className="text-sm font-medium"
                id="current_song_footer"
              ></div>
            </div>
          </div>
        </div>
        <div
          className="fixed grid px-10 w-full bottom-0 right-0 left-0"
          style={{
            height: "80px",
            minHeight: "80px",
            borderTop: "2px solid #282828",
            gridTemplateColumns: "0.5fr 3fr",
          }}
        >
          <div className="py-5 flex gap-4">
            <div className="py-2" style={{ cursor: "not-allowed" }}>
              <svg
                fill="white"
                role="img"
                height="16"
                width="16"
                viewBox="0 0 16 16"
              >
                <path d="M13 2.5L5 7.119V3H3v10h2V8.881l8 4.619z"></path>
              </svg>
            </div>
            <div
              id="pause-resume-btn"
              style={{
                borderRadius: "50%",
                height: "32px",
                minWidth: "32px",
                minHeight: "32px",
                width: "32px",
                background: "white",
                color: "black",
                cursor: "pointer",
                padding: "7.6px",
              }}
            >
              <svg role="img" height="16" width="16" viewBox="0 0 16 16">
                <path fill="none" d="M0 0h16v16H0z"></path>
                <path d="M3 2h3v12H3zm7 0h3v12h-3z"></path>
              </svg>
            </div>
            <div className="py-2" style={{ cursor: "not-allowed" }}>
              <svg
                fill="white"
                role="img"
                height="16"
                width="16"
                viewBox="0 0 16 16"
              >
                <path d="M11 3v4.119L3 2.5v11l8-4.619V13h2V3z"></path>
              </svg>
            </div>
          </div>
          <div className="py-8">
            <div id="song-progress" className={styles["song-progress"]}>
              <div
                id="song-progress-track"
                className={styles["song-track"]}
              ></div>
            </div>
            <div className="flex text-sm font-semibold">
              <div id="elapsed"></div>
              <div
                id="total"
                style={{
                  marginLeft: "auto",
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
