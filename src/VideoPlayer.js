import {useEffect, useRef, useState} from 'react';

import styled from '@emotion/styled/macro';

import PropTypes, { array, string } from 'prop-types';

import YouTube from 'react-youtube';

const VideoPlayer = (props) => {
  const videoRef = useRef(null);

  const [cues, setCues] = useState([]);

  const [progressTime, setProgressTime] = useState(0);
  const [currentCueText, setCurrentCueText] = useState(null);

  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [newCueText, setNewCueText] = useState('');

  useEffect(() => {
    setCues(props.cues);
  },[]);

  useEffect(() => {
    cues?.forEach(cue => {
      if (cue.start <= progressTime  && progressTime <= cue.end) {
        setCurrentCueText(cue.text);
      }
  });
  },[progressTime]);

  useEffect(() => {
    if (currentCueText) {
      videoRef.current.internalPlayer.pauseVideo();

      let utterThis = new SpeechSynthesisUtterance(currentCueText)
      speechSynth.speak(utterThis);

      utterThis.addEventListener('end', () => {
        videoRef.current.internalPlayer.playVideo();
      });

    }
  },[currentCueText]);

  const speechSynth = window.speechSynthesis;

  const onReady = (ev) => {
    const iframeWindow = ev.target.getIframe().contentWindow;

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

  return (
    <>
      <h1>Bienvideo!</h1>
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
