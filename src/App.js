import React from "react";
import "react-svg-loader";
import "./App.css";
import { SpotifyPlayer } from "./components/SpotifyPlayer";

function App() {
  return (
    <div className="App">
      <SpotifyPlayer />
    </div>
  );
}

export default App;
