import React from "react";
import { SpotifyPlayer } from "./components/Spotify";
import "./App.css";

function App() {
  return (
    <div className="App">
      <SpotifyPlayer renderAsSvg={true} />
    </div>
  );
}

export default App;
