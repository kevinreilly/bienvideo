import {useEffect, useRef, useState} from 'react';

import styled from '@emotion/styled/macro';

import PropTypes, { array, string } from 'prop-types';

import YouTube from 'react-youtube';

import { API, Storage } from 'aws-amplify';

import {
  createTrack as createTrackMutation
} from "./graphql/mutations";

let sampleCues = [
  {
    start: 2,
    end: 4,
    text: 'this is a test or a fairly long text track cue that should be longer then its alloted time range',
  },
  {
    start: 10,
    end: 16,
    text: 'this is another test',
  }
]

const VideoPlayer = (props) => {
  const videoRef = useRef(null);

  const [cues, setCues] = useState([]);

  const [nextCueIndex, setNextCueIndex] = useState(0);

  const [progressTime, setProgressTime] = useState(0);
  const [currentCue, setCurrentCue] = useState(null);

  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [newCueText, setNewCueText] = useState('');

  const [pseudoPaused, setPseudoPaused] = useState(false);

  useEffect(() => {
    setCues(sampleCues);
  },[]);

  useEffect(() => {
    if (speechSynth.speaking) {
      if (progressTime >= currentCue.end) {
        videoRef.current.internalPlayer.pauseVideo();
        setPseudoPaused(true);
      }
    } else {
      cues?.forEach(cue => {
        if (cue.start <= progressTime  && progressTime <= cue.end) {
          setCurrentCue(cue);
        }
      });
    }
  },[progressTime]);

  useEffect(() => {
    if (currentCue) {
      let utterThis = new SpeechSynthesisUtterance(currentCue.text);
      speechSynth.speak(utterThis);

      utterThis.addEventListener('end', () => {
        videoRef.current.internalPlayer.playVideo();
        setPseudoPaused(false);
      });
    }
  },[currentCue]);

  const speechSynth = window.speechSynthesis;

  const onReady = (ev) => {
    const iframeWindow = ev.target.getIframe().contentWindow;

    speechSynth.cancel();

    window.addEventListener("message", function(ev) {
      if (ev.source === iframeWindow) {
        let data = JSON.parse(ev.data);
        if (data.event === "infoDelivery" && data.info && data.info.currentTime) {
          setProgressTime(data.info.currentTime);
        }
      }
    })
  }

  const handleAddCueClick = () => {
    setCues([
      ...cues,
      {
        start: startTime,
        end: endTime,
        text: newCueText,
      }
    ]);
  }

  const handleDeleteCueClick = (cueIndex) => {
    let cuesCopy = [...cues];
    cuesCopy.splice(cueIndex, 1);
    setCues(cuesCopy);
  }

  const handleAddTrack = () => {
    createTrack();
  }

  async function createTrack() {
    const data = {
      videoID: "M7lc1UVf-VE",
      cues: JSON.stringify(sampleCues)
    };
    await API.graphql({
      query: createTrackMutation,
      variables: { input: data },
    });
  }

  const handlePlay = () => {
    if (speechSynth.paused) {
      speechSynth.resume();
    } else if (speechSynth.speaking) {
      videoRef.current.internalPlayer.pauseVideo();
      speechSynth.pause();
    }
  }

  const handlePause = () => {
    if (!pseudoPaused && speechSynth.speaking) {
      speechSynth.pause();
    }
  }

  return (
    <>
      <YouTube
        ref={videoRef}
        videoId={props.videoID}
        opts={{
          playerVars: {
            origin: 'http://localhost:3000',
            modestbranding: 1,
            rel: 0,
          },
        }}
        onReady={onReady}
        onPlay={handlePlay}
        onPause={handlePause}
      />
      <StyledControls>
        <label>
          Cue Text
          <input
            type="text"
            value={newCueText}
            onChange={(ev) => setNewCueText(ev.target.value)}
          />
        </label>
        <label>
          Start Time
          <input
            type="number"
            value={startTime}
            onChange={(ev) => setStartTime(ev.target.value)}
          />
          <button
            onClick={() => setStartTime(progressTime)}>
            set
          </button>
        </label>
        <label>
          End Time
          <input
            type="number"
            value={endTime}
            onChange={(ev) => setEndTime(ev.target.value)}
          />
          <button
            onClick={() => setEndTime(progressTime)}>
            set
          </button>
        </label>
      </StyledControls>
      <button
        onClick={handleAddCueClick}
        disabled={!newCueText}
        >
        Add Cue
      </button>
      <ul>
        {cues.sort((a,b) => b.start - a.start).map((cue, i) =>
          <li key={i}>
            <p>{`${cue.start} - ${cue.end}`}</p>
            <p>{cue.text}</p>
            <button
              onClick={() => handleDeleteCueClick(i)}>
              delete
            </button>
          </li>
        )}
      </ul>
      <button
        onClick={handleAddTrack}>
        Add Track
      </button>
    </>
  );
}

VideoPlayer.propTypes = {
  cues: array,
  videoID: string,
}

const StyledControls = styled.div`
  display: flex;
`;

export default VideoPlayer;
