import {useEffect, useState} from 'react';

import { API } from 'aws-amplify';

import {
  videosByVid,
  tracksByVideoID,
} from "./graphql/queries";

import {
  Alert,
  AlertTitle,
  Button,
} from '@mui/material';

import VideoPlayer from "./VideoPlayer";

const Stage = (props) => {

  const [videoData, setVideoData] = useState(null);
  const [trackData, setTrackData] = useState(null);

  const [hasTracks, setHasTracks] = useState(true);

  useEffect(() => {
    props.vid && fetchVideo(props.vid);
  },[props.vid]);

  useEffect(() => {
    console.log(`videoData`, videoData);
    if (videoData) {
      if (videoData.items.length) {
        setHasTracks(true);
        fetchTracks(videoData.items[0].id);
      } else {
        setHasTracks(false);
      }
    }
  },[videoData]);

  useEffect(() => {
    console.log(`trackData`, trackData);
    if (trackData) {
      if (trackData.items.length) {
        setHasTracks(true);
      } else {
        setHasTracks(false);
      }
    }
  },[trackData]);

  async function fetchVideo(vid) {
    const apiData = await API.graphql({
      query: videosByVid,
      variables: {vid: vid},
    });
    setVideoData(apiData.data.videosByVid);
  }

  async function fetchTracks(id) {
    const apiData = await API.graphql({
      query: tracksByVideoID,
      variables: {videoID: id},
    });
    setTrackData(apiData.data.tracksByVideoID);
  }

  return (
    <>
      {!hasTracks &&
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
      }
      {props.vid &&
        <VideoPlayer vid={props.vid} tracks={trackData} />
      }
    </>
  )
}

export default Stage;