import React from "react";
import { SpotifyPlayer } from "./components/Spotify";
import "./App.css";

function App() {
  return (
    <div className="App">
      <svg viewBox="0 0 350 200">
        <SpotifyPlayer renderAsSvg={true} />
      </svg>
    </div>
  );
}

export default App;
