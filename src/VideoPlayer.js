import {useEffect, useRef, useState} from 'react';

import { API } from 'aws-amplify';

import {
  videosByVid,
} from "./graphql/queries";

import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Typography,
} from '@mui/material';

import Grid from '@mui/material/Unstable_Grid2';

import PropTypes, { array, object, string } from 'prop-types';

import ReactPlayer from 'react-player';

import { createSilentAudio } from 'create-silent-audio';

const VideoPlayer = (props) => {
  const audioRef = useRef(null);
  const videoRef = useRef(null);

  const [ready, setReady] = useState(false);

  const [trackURL, setTrackURL] = useState(null);
  const [audioSpoof, setAudioSpoof] = useState(null);

  const [videoData, setVideoData] = useState(null);
  const [tags, setTags] = useState(null);

  const speechSynth = window.speechSynthesis;

  const secondsToTime = (numSeconds) => {
    let pad = function(num, size) { return ('000' + num).slice(size * -1); },
    time = parseFloat(numSeconds).toFixed(3),
    hours = Math.floor(time / 60 / 60),
    minutes = Math.floor(time / 60) % 60,
    seconds = Math.floor(time - minutes * 60),
    milliseconds = time.slice(-3);

    return pad(hours, 2) + ':' + pad(minutes, 2) + ':' + pad(seconds, 2) + '.' + pad(milliseconds, 3);
  }

  useEffect(() => {
    if (props.tracks?.items?.length) {
      console.log('tracks');
      let cues = `WEBVTT`;

      JSON.parse(props.tracks.items[0].cues).map((cue) => {
        let cueData = JSON.parse(cue);
        cues += `

${secondsToTime(cueData.start)} --> ${secondsToTime(cueData.end)}
${cueData.text}`
      });
      setTrackURL(URL.createObjectURL(new Blob ([cues], {type: 'text/plain', endings: 'native'})));
    }

    const vidurl = `https://www.youtube.com/watch?v=${props.vid}`;

    fetch(`https://noembed.com/embed?dataType=json&url=${vidurl}`)
      .then(res => res.json())
      .then(data => setVideoData({
        url: data.url,
        title: data.title,
        author_name: data.author_name,
        thumbnail_url: data.thumbnail_url
    }));

    fetchVideo(props.vid);
  },[props.vid, props.tracks]);

  async function fetchVideo(id) {
    const apiData = await API.graphql({
      query: videosByVid,
      variables: {vid: id},
    });
    //setTags(apiData.data.videosByVid.items[0].tags);
  }

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
    /*
    const videoElement = videoRef.current.getInternalPlayer();
    setTimeout(() => {
      videoElement.g.setAttribute('tabindex', '-1');
      console.log(videoElement.g.contentDocument);
    }, 1000);
    */
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

  const handleInternalPlayClick = (ev) => {
    if (ev.key === ' ' || ev.key === 'k') {
      ev.preventDefault();
      const internalPlayer = videoRef.current.getInternalPlayer();
      internalPlayer.getPlayerState() === 1 ? internalPlayer.pauseVideo() : internalPlayer.playVideo();
    }
  }

  return (
    <Grid container rowSpacing={2} component="figure">
      <Grid xs={12}>
        <Box sx={{position: 'relative', pt: '56.25%', width: '100%'}}>
          <ReactPlayer
            ref={videoRef}
            controls={true}
            url={`https://www.youtube.com/watch?v=${props.vid}`}
            width="100%"
            height="100%"
            style={{position: 'absolute', top: 0, left: 0}}
            onDuration={handleDuration}
            onReady={onReady}
            onPlay={handlePlay}
            onPause={handlePause}
            onProgress={handleProgress}
            //aria-label="video player"
            //tabIndex="0"
            onKeyDown={handleInternalPlayClick}
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
            style={{display: 'none'}}
            >
            <track src={trackURL} kind="descriptions" srcLang='en' label="English"></track>
          </audio>
        }
      </Grid>
      <Grid xs={12} px={2} component="figcaption">
        <Typography
          variant="h6"
          component="h2"
          >
          {videoData?.title}
        </Typography>
        <Typography gutterBottom variant="body2" color="text.secondary">
          {videoData?.author_name}
        </Typography>
        {tags?.map((tag, i) =>
          <Chip
            key={i}
            size="small"
            variant="outlined"
            label={tag}
          />
        )}
      </Grid>
    </Grid>
  );
}

VideoPlayer.propTypes = {
  vid: string,
  tracks: object,
}

export default VideoPlayer;
