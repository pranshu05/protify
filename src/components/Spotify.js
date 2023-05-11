import React, { useEffect, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import getNowPlayingItem from "../APIs/SpotifyAPI";
import ProgressBar from "@ramonak/react-progress-bar";

export function SpotifyPlayer(props) {
  const [result, setResult] = useState({});

  useEffect(() => {
    Promise.all([
      getNowPlayingItem(
        props.client_id,
        props.client_secret,
        props.refresh_token
      ),
    ]).then((results) => {
      setResult(results[0]);
    });
  });

  useEffect(() => {
    const svgMarkup = renderToStaticMarkup(renderComponent());
    console.log(svgMarkup);
  });

  const renderComponent = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="350"
        height="200"
        viewBox="0 0 350 200"
      >
        <foreignObject x="0" y="0" width="350" height="200">
          <div xmlns="http://www.w3.org/1999/xhtml">
            <div className="nowplaying">
              <div className="spotify-cont">
                <div className="spotify-track">
                  {result.isPlaying ? (
                    <a href={result.songUrl} target="_blank" rel="noreferrer">
                      <div className="song-img">
                        <img
                          src={result.albumImageUrl}
                          alt={`Album cover for ${result.title}`}
                        />
                      </div>
                      <div className="song-info">
                        <div className="song-title">{result.title}</div>
                        <div className="song-artist">
                          <small>
                            by {result.artist} <br /> on {result.albumName}
                          </small>
                        </div>
                        <ProgressBar
                          completed={result.progressMs}
                          maxCompleted={result.durationMs}
                          bgColor="#dbb3fe"
                          height="8px"
                          labelColor="#dbb3fe"
                          baseBgColor="#121212"
                          transitionDuration="0s"
                        />
                      </div>
                    </a>
                  ) : (
                    <div>
                      <div className="song-img">
                        <img
                          src="https://user-images.githubusercontent.com/70943732/232979556-2a30490b-10ab-4da3-9d7d-359e0afa6b23.png"
                          alt="music"
                        />
                      </div>
                      <div className="song-info">
                        <div className="song-artist">
                          Not listening to Spotify rn!
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </foreignObject>
      </svg>
    );
  };

  return <div>{renderComponent()}</div>;
}
