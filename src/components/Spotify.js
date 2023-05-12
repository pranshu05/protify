import { useEffect, useState } from "react";
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

  const imageUrls = [
    "https://wallpapercave.com/wp/wp8151920.jpg",
    "https://wallpapercave.com/wp/wp5126947.jpg",
    "https://e0.pxfuel.com/wallpapers/230/630/desktop-wallpaper-anime-aesthetic-pc-anime-aesthetic-pc-background-on-bat-retro-anime-aesthetic.jpg",
    "https://i.pinimg.com/736x/80/7c/a1/807ca16b42e5fe7dc8a5794157076559.jpg",
    "https://wallpapercave.com/wp/wp8151805.jpg",
    "https://wallpaperaccess.com/full/839071.jpg",

    // Add more image URLs as needed
  ];

  const randomImageUrl =
    imageUrls[Math.floor(Math.random() * imageUrls.length)];

  return result.isPlaying ? (
    <div
      className="spotify-cont"
      style={{
        backgroundImage: `url(${result.albumImageUrl})`,
        backgroundSize: "cover",
      }}
    >
      <div className="blur"></div>
      <div className="spotify-track">
        <a href={result.songUrl} target="_blank" rel="noreferrer">
          <div className="song-img">
            <img
              src={result.albumImageUrl}
              alt={`Album cover for ${result.title}`}
            />
          </div>
          <div className="song-info">
            <div className="song-title">{result.title}</div>
            <div className="song-artist">by {result.artist}</div>
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
      </div>
    </div>
  ) : (
    <div
      className="spotify-cont"
      style={{
        backgroundImage: `url(${randomImageUrl})`,
        backgroundSize: "cover",
      }}
    >
      <div className="spotify-track">
        <div className="song-img">
          <img
            src="https://github.com/pranshu05/pranshu05/assets/70943732/3d6adedd-1652-4042-8781-698fa1841326"
            alt="music"
          />
        </div>
        <div className="song-info">
          <div className="song-title">Not listening to Spotify rn!</div>
        </div>
      </div>
    </div>
  );
}
