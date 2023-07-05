import {useEffect, useRef, useState} from 'react';

import {
  Alert,
  AlertTitle,
  Box,
  Button,
  CircularProgress,
  Grid,
  Typography,
} from '@mui/material';

import PropTypes, { array, string } from 'prop-types';

import ReactPlayer from 'react-player';

import { createSilentAudio } from 'create-silent-audio';

const VideoPlayer = (props) => {
  const audioRef = useRef(null);
  const videoRef = useRef(null);

  const [ready, setReady] = useState(false);

  const [trackURL, setTrackURL] = useState(null);
  const [audioSpoof, setAudioSpoof] = useState(null);

  const speechSynth = window.speechSynthesis;

  const savedVideo = 'KDRnEm-B3AI';

  useEffect(() => {
    if (props.videoID === savedVideo) {
      setTrackURL(URL.createObjectURL(new Blob ([
`WEBVTT

00:01.000 --> 00:03.000
This is along sentence that should exceed its alloted time range so that the video is forced to pause and wait for it to finish.

00:05.000 --> 00:09.000
It will perforate your stomach.
You could die.`
        ], {type: 'text/plain', endings: 'native'})));
    } else {
      setTrackURL(null);
    }
  },[]);

  const startDescribing = (activeCue) => {
    let utterance = new SpeechSynthesisUtterance(activeCue.text);

    speechSynth.speak(utterance);

    utterance.onend = () => {
      videoRef.current.getInternalPlayer().playVideo();
    }
  }

  useEffect(() => {
    audioSpoof &&
      audioRef.current?.addEventListener('loadedmetadata', () => {
        setReady(true);
        let descTrack = audioRef.current.textTracks[0];
        descTrack.mode = 'showing';
        descTrack.oncuechange = () => {
          if (descTrack.activeCues.length) {
            startDescribing(descTrack.activeCues[0]);
          } else {
            if (speechSynth.speaking) {
              videoRef.current.getInternalPlayer().pauseVideo();
            }
          }
        }
      });
  },[audioSpoof]);

  const onReady = (ev) => {
    speechSynth.cancel();
  }

  const handleDuration = (duration) => {
    setAudioSpoof(createSilentAudio(duration));
  }

  const handlePlay = () => {
    audioRef.current.play();
  }

  const handlePause = () => {
    audioRef.current.pause();
  }

  const handleProgress = (progress) => {
    audioRef.current.currentTime = progress.playedSeconds;
  }

  return (
    <Grid container gap={2}>
      {(ready && !trackURL) &&
        <Grid xs={12} px={2}>
          <Alert
            variant="outlined"
            severity="info"
            action={
              <Button color="inherit" size="small">
                Request
              </Button>
            }
            >
            <AlertTitle>No Descriptions Found</AlertTitle>
            Unfortunately, our volunteers haven't described this video yet. Request that they do.
          </Alert>
        </Grid>
      }
      <Box sx={{position: 'relative', pt: '56.25%', width: '100%'}}>
        <ReactPlayer
          ref={videoRef}
          controls={true}
          url={`https://www.youtube.com/watch?v=${props.videoID}`}
          width="100%"
          height="100%"
          style={{position: 'absolute', top: 0, left: 0}}
          onDuration={handleDuration}
          onReady={onReady}
          onPlay={handlePlay}
          onPause={handlePause}
          onProgress={handleProgress}
        />
        {!ready &&
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'rgba(0,0,0,0.75)'
            }}>
            <CircularProgress />
          </Box>
        }
      </Box>
      {audioSpoof &&
        <audio
          ref={audioRef}
          src={audioSpoof}
          controls
          >
          <track src={trackURL} kind="descriptions" srcLang='en' label="English"></track>
        </audio>
      }
    </Grid>
  );
}

VideoPlayer.propTypes = {
  cues: array,
  videoID: string,
}

export default VideoPlayer;
