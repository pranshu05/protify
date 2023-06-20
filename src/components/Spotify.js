import { useEffect, useState } from "react";
import getNowPlayingItem from "../APIs/SpotifyAPI";
import axios from "axios";
import ProgressBar from "@ramonak/react-progress-bar";
import { CSSTransition, TransitionGroup } from "react-transition-group";

export function SpotifyPlayer(props) {
  const [result, setResult] = useState({});
  const [lyrics, setLyrics] = useState([]);
  const [lyricsError, setLyricsError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchNowPlayingItem = async () => {
      try {
        const nowPlayingItem = await getNowPlayingItem(
          props.client_id,
          props.client_secret,
          props.refresh_token
        );

        if (isMounted) {
          setResult(nowPlayingItem);
          fetchLyrics(nowPlayingItem.trackId);
        }
      } catch (error) {
        console.error("Error fetching now playing item:", error);
        if (isMounted) {
          setResult({});
          setLyricsError(true);
        }
      }
    };

    const fetchLyrics = async (trackId) => {
      try {
        const options = {
          method: "GET",
          url: "https://spotify-scraper.p.rapidapi.com/v1/track/lyrics",
          params: {
            trackId: trackId,
            format: "json",
          },
          headers: {
            "X-RapidAPI-Key":
              "89a832a4d8msh9fe27013e09ac56p1c3d0ajsn108af9c5fee6",
            "X-RapidAPI-Host": "spotify-scraper.p.rapidapi.com",
          },
        };

        const response = await axios.request(options);
        const lyricsData = response.data;

        if (isMounted) {
          if (lyricsData.error) {
            setLyricsError(true);
          } else {
            const transformedLyrics = lyricsData.map((line) => ({
              startTimeMs: line.startMs,
              endTimeMs: line.startMs + line.durMs,
              words: line.text,
            }));
            setLyrics(transformedLyrics);
          }
        }
      } catch (error) {
        console.error("Error fetching lyrics:", error);
        if (isMounted) {
          setLyricsError(true);
        }
      }
    };

    fetchNowPlayingItem();

    const interval = setInterval(() => {
      fetchNowPlayingItem();
    }, 5000); // Update every 5 seconds (adjust as needed)

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [props.client_id, props.client_secret, props.refresh_token]);

  const getCurrentLyricLine = () => {
    const currentTimeMs = result.progressMs;

    for (let i = 0; i < lyrics.length; i++) {
      const line = lyrics[i];
      const startTimeMs = parseInt(line.startTimeMs);

      if (startTimeMs <= currentTimeMs && currentTimeMs <= line.endTimeMs) {
        return line;
      }
    }

    return null;
  };

  const getPreviousLyricLine = () => {
    const currentLineIndex = getCurrentLyricLineIndex();

    if (currentLineIndex > 0) {
      return lyrics[currentLineIndex - 1];
    }

    return null;
  };

  const getNextLyricLine = () => {
    const currentLineIndex = getCurrentLyricLineIndex();

    if (currentLineIndex < lyrics.length - 1) {
      return lyrics[currentLineIndex + 1];
    }

    return null;
  };

  const getCurrentLyricLineIndex = () => {
    const currentTimeMs = result.progressMs;

    for (let i = 0; i < lyrics.length; i++) {
      const line = lyrics[i];
      const startTimeMs = parseInt(line.startTimeMs);

      if (startTimeMs <= currentTimeMs && currentTimeMs <= line.endTimeMs) {
        return i;
      }
    }

    return -1;
  };

  const renderLyricLine = (line, isActive, isPrevious, isNext) => {
    return (
      <CSSTransition
        key={line.startTimeMs}
        timeout={500}
        classNames={{
          enter: "fade-enter",
          enterActive: "fade-enter-active",
          exit: "fade-exit",
          exitActive: "fade-exit-active",
        }}
      >
        <div
          className={`lyric-line ${isActive ? "active" : ""} ${
            isPrevious ? "previous" : ""
          } ${isNext ? "next" : ""}`}
        >
          {line.words}
        </div>
      </CSSTransition>
    );
  };

  const renderLyrics = () => {
    if (lyricsError) {
      return (
        <div className="lyrics-container">
          <div className="lyric-line"></div>
        </div>
      );
    }

    const currentLine = getCurrentLyricLine();
    const previousLine = getPreviousLyricLine();
    const nextLine = getNextLyricLine();

    return (
      <div className="lyrics-container">
        <TransitionGroup>
          {previousLine && renderLyricLine(previousLine, false, true, false)}
        </TransitionGroup>
        <TransitionGroup>
          {currentLine && renderLyricLine(currentLine, true, false, false)}
        </TransitionGroup>
        <TransitionGroup>
          {nextLine && renderLyricLine(nextLine, false, false, true)}
        </TransitionGroup>
      </div>
    );
  };

  return result.isPlaying ? (
    <div
      className="spotify-cont"
      style={{
        backgroundImage: `url(${result.albumImageUrl})`,
        backgroundSize: "cover",
      }}
    >
      <div className="blur"></div>
      <div className="container">
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
        {renderLyrics()}
      </div>
    </div>
  ) : (
    <div
      className="spotify-cont"
      style={{
        backgroundImage:
          "url(https://e0.pxfuel.com/wallpapers/230/630/desktop-wallpaper-anime-aesthetic-pc-anime-aesthetic-pc-background-on-bat-retro-anime-aesthetic.jpg)",
        backgroundSize: "cover",
      }}
    >
      <div className="blur"></div>
      <div className="container">
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
    </div>
  );
}
