import {useEffect, useState} from 'react';

import { useOutletContext, useSearchParams } from "react-router-dom";

import {
  Box,
  Button,
  Card,
  CardActions,
  CardActionArea,
  InputAdornment,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

import {
  ArrowRightAlt as ArrowRightAltIcon,
  MyLocation as MyLocationIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

import VideoPlayer from "./VideoPlayer";

import { secondsToTime } from "./utils";

import { API } from 'aws-amplify';

import {
  videosByVid,
  getTrack,
} from "./graphql/queries";

import {
  createTrack as createTrackMutation,
  createVideo as createVideoMutation,
  deleteTrack as deleteTrackMutation,
  updateTrack as updateTrackMutation,
  updateVideo as updateVideoMutation,
} from "./graphql/mutations";

const TrackEditor = (props) => {

  const [searchParams, setSearchParams] = useSearchParams();

  const {
    activeVID,
    user,
  } = useOutletContext();

  const [videoData, setVideoData] = useState(null);

  const [isNewVideo, setIsNewVideo] = useState(false);

  const [editingCue, setEditingCue] = useState(null);

  const [startFieldValue, setStartFieldValue] = useState(0);
  const [endFieldValue, setEndFieldValue] = useState(0);
  const [cueFieldValue, setCueFieldValue] = useState('');

  const [currentTime, setCurrentTime] = useState(0);

  const [cues, setCues] = useState([]);

  const [trackData, setTrackData] = useState(null);

  useEffect(() => {
    fetchVideo(activeVID);

    (searchParams.size && searchParams.get('track')) && fetchTrack(searchParams.get('track'));
  },[]);

  useEffect(() => {
    trackData && setCues(JSON.parse(trackData.cues));
  },[trackData]);

  useEffect(() => {
    (videoData?.items.length && isNewVideo) && createTrack();
  },[videoData]);

  const handleTimeChange = (time) => {
    setCurrentTime(time);
  }

  const handleTargetClick = (place) => {
    if (place === 'start') {
      setStartFieldValue(currentTime);
    } else if (place === 'end') {
      setEndFieldValue(currentTime);
    }
  }

  const handleAddCueClick = () => {
    let cuesCopy = [...cues];

    cuesCopy.push({
      start: Number(startFieldValue),
      end: Number(endFieldValue),
      text: cueFieldValue
    });

    cuesCopy.sort((a, b) => a.start - b.start);

    setCues(cuesCopy);
  }

  const handleSubmitClick = () => {
    if (videoData.items.length) {
      if (trackData) {
        updateTrack();
      } else {
        createTrack();
        updateVideo();
      }
    } else {
      createVideo().then(() => 
        fetchVideo(activeVID)
      )
    }
  }

  const handleDeleteClick = () => {
    deleteTrack();
  }

  async function createTrack() {
    const data = {
      cues: JSON.stringify(cues),
      videoID: videoData.items[0].id,
      createdBy: user.attributes.sub,
    };
    await API.graphql({
      query: createTrackMutation,
      variables: { input: data },
    });
  }

  async function updateVideo() {
    const data = {
      id: videoData.items[0].id,
      tags: ['described'],
      requests: [],
    };
    await API.graphql({
      query: updateVideoMutation,
      variables: { input: data },
    });
  }

  async function createVideo() {
    setIsNewVideo(true);
    const data = {
      vid: activeVID,
      tags: ['described'],
    };
    await API.graphql({
      query: createVideoMutation,
      variables: { input: data },
    });
  }

  async function fetchVideo(vid) {
    const apiData = await API.graphql({
      query: videosByVid,
      variables: {vid: vid},
    });
    setVideoData(apiData.data.videosByVid);
  }

  async function fetchTrack(id) {
    const apiData = await API.graphql({
      query: getTrack,
      variables: {id: id},
    });
    setTrackData(apiData.data.getTrack);
  }

  async function updateTrack() {
    const data = {
      id: trackData.id,
      cues: JSON.stringify(cues),
    };
    await API.graphql({
      query: updateTrackMutation,
      variables: { input: data },
    });
  }

  async function deleteTrack() {
    const data = {
      id: trackData.id,
    };
    await API.graphql({
      query: deleteTrackMutation,
      variables: { input: data },
    });
  }

  const handleStartFieldValueChange = (ev) => {
    setStartFieldValue(ev.target.value);
  }

  const handleEndFieldValueChange = (ev) => {
    setEndFieldValue(ev.target.value);
  }

  const handleCueFieldValueChange = (ev) => {
    setCueFieldValue(ev.target.value);
  }

  const handleCueClick = (index) => {
    setEditingCue(index);

    setStartFieldValue(cues[index].start);
    setEndFieldValue(cues[index].end);
    setCueFieldValue(cues[index].text);
  }

  const handleUpdateCueClick = () => {
    let cuesCopy = [...cues];

    cuesCopy[editingCue] = {
      start: startFieldValue,
      end: endFieldValue,
      text: cueFieldValue,
    }

    setCues(cuesCopy);
  }

  const handleDeleteCueClick = (index = editingCue) => {
    let cuesCopy = [...cues];
    cuesCopy.splice(index, 1);
    setCues(cuesCopy);

    setEditingCue(null);
    clearCueFields();
  }

  const handleCancelCueClick = () => {
    setEditingCue(null);
    clearCueFields();
  }

  const clearCueFields = () => {
    setStartFieldValue('');
    setEndFieldValue('');
    setCueFieldValue('');
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      p: 2,
      gap: 2,
      }}>
      <Grid container columnSpacing={2} rowSpacing={4}>
        <Grid xs={12} sm={6} md={8}>
          <VideoPlayer
            vid={activeVID}
            tracks={cues}
            onTimeChange={handleTimeChange}
          />

          <Stack spacing={2}>

            <Typography variant="body1" component="h3">
              {Number.isInteger(editingCue) ? 'Edit description cue' : 'Add a description cue'}
            </Typography>
            
            <Stack spacing={1} direction="row" alignItems="center">

              <Box sx={{flexGrow: 1}}>
                <TextField
                  label="Start"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={startFieldValue}
                  onChange={handleStartFieldValueChange}
                  type="number"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          edge="end"
                          onClick={() => handleTargetClick('start')}>
                          <MyLocationIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Box>

              <ArrowRightAltIcon />

              <Box sx={{flexGrow: 1}}>

                <TextField
                  label="End"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={endFieldValue}
                  onChange={handleEndFieldValueChange}
                  type="number"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          edge="end"
                          onClick={() => handleTargetClick('end')}>
                          <MyLocationIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />

              </Box>
            </Stack>

            <TextField
              label="Description"
              variant="outlined"
              size="small"
              fullWidth
              multiline
              rows={3}
              value={cueFieldValue}
              onChange={handleCueFieldValueChange}
            />

            <Box sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              }}>
              
              {Number.isInteger(editingCue) ?
                <>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleUpdateCueClick}
                    >
                    Update
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleDeleteCueClick}
                    >
                    Delete
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleCancelCueClick}
                    >
                    Cancel
                  </Button>
                </>
                :
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleAddCueClick}
                  >
                  Add
                </Button>
              }
            </Box>
          </Stack>
        </Grid>
        
        <Grid xs={12} sm={6} md={4}>
          <Stack spacing={2}>
            <Stack
              spacing={2}
              direction="row"
              justifyContent="space-between"
              alignItems="center">
              <Typography variant="body1" component="h3">
                Description Cues
              </Typography>
              <Stack direction="row" gap={2}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleSubmitClick}
                  >
                  Submit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={handleDeleteClick}
                  >
                  delete
                </Button>
              </Stack>
            </Stack>
            
            {cues.length ?
              <Stack spacing={2}>
                {cues.map((cue, i) =>
                  <Card key={i} sx={{display: 'flex'}}>
                    <CardActionArea
                      onClick={() => handleCueClick(i)}
                      sx={{p: 2}}
                      >
                      <Typography variant="overline">{`${secondsToTime(cue.start)} - ${secondsToTime(cue.end)}`}</Typography>
                      <Typography variant="body2">{cue.text}</Typography>
                    </CardActionArea>
                    <CardActions>
                      <IconButton size="small" onClick={() => handleDeleteCueClick(i)}>
                        <DeleteIcon fontSize="inherit" />
                      </IconButton>
                    </CardActions>
                  </Card>
                )}
              </Stack>
            : <Typography variant="caption" align="center">nothing here yet</Typography>
            }
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}

export default TrackEditor;