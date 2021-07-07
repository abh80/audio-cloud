import React from "react";
import styles from "./styles/Home.module.css";
import TitleBarMac from "./components/MacControls";
import TitleBarWin from "./components/WindowControls";
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
      <div>
        {this.state.platform ? (
          this.state.platform === "win32" ? (
            <TitleBarWin />
          ) : (
            <TitleBarMac />
          )
        ) : (
          <TitleBarMac />
        )}
      </div>
    );
  }
}

export default App;
