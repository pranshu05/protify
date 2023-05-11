import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { SpotifyPlayer } from "../components/Spotify";

export function renderSvg() {
  const svgMarkup = renderToStaticMarkup(<SpotifyPlayer />);
  return svgMarkup;
}
