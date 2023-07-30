import {useEffect, useState} from 'react';

import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';

import { API } from 'aws-amplify';

import {
  useAuthenticator,
} from '@aws-amplify/ui-react';

import {
  videosByVid,
  tracksByVideoID,
} from "./graphql/queries";

import {
  createVideo as createVideoMutation,
  updateVideo as updateVideoMutation,
} from "./graphql/mutations";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  AlertTitle,
  Box,
  Button,
  Stack,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
} from '@mui/material';

import {
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';

import { youtubeURLParser } from './utils';

import VideoPlayer from "./VideoPlayer";

const Stage = (props) => {

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { user } = useAuthenticator((context) => [context.user]);

  const [activeVID, setActiveVID] = useState(null);

  const [videoData, setVideoData] = useState(null);
  const [trackData, setTrackData] = useState(null);

  const [hasTracks, setHasTracks] = useState(true);

  const [activeTrack, setActiveTrack] = useState(0);

  const [requested, setRequested] = useState(false);

  useEffect(() => {
    setActiveVID(searchParams.size ? youtubeURLParser(searchParams.get('url')) : null);
  },[searchParams]);

  useEffect(() => {
    activeVID && fetchVideo(activeVID);
  },[activeVID]);

  useEffect(() => {
    console.log(`videoData`, videoData);
    if (videoData) {
      if (videoData.items.length) {
        setHasTracks(true);
        fetchTracks(videoData.items[0].id);
        setRequested(videoData.items[0].requests?.includes(user.attributes.sub));
      } else {
        setTrackData(null);
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

  async function createVideo() {
    const data = {
      vid: activeVID,
      requests: [user.attributes.sub],
    };
    await API.graphql({
      query: createVideoMutation,
      variables: { input: data },
    });
  }

  async function updateVideo() {
    let requests = videoData.items[0].requests ?? [];
    requests.push(user.attributes.sub);

    const data = {
      id: videoData.items[0].id,
      requests: requests,
    };
    await API.graphql({
      query: updateVideoMutation,
      variables: { input: data },
    });
  }

  async function createRequest() {
    updateVideo();
  }

  const handleDescribeClick = (trackID) => {
    let params = {url: searchParams.get('url')};
    trackID && (params.track = trackID);
    user && navigate({
      pathname: '/create',
      search: `?${createSearchParams(params)}`
    });
  }

  const handleRequestClick = () => {
    hasTracks ? createRequest() : createVideo();
    setRequested(true);
  }

  const handleSetActiveTrackClick = (index) => {
    setActiveTrack(index);
  }

  return (
    <>
      {!hasTracks &&
        <Alert
          variant="outlined"
          severity="info"
          action={
            <>
              <Button
                color="inherit"
                size="small"
                onClick={() => user ? handleRequestClick() : props.handleDialogOpen()}
                >
                Request
              </Button>
              <Button
                color="inherit"
                size="small"
                onClick={() => user ? handleDescribeClick() : props.handleDialogOpen()}>
                Describe
              </Button>
            </>
          }
          >
          <AlertTitle>No Descriptions Found</AlertTitle>
          Unfortunately, our volunteers haven't described this video yet. Request that they do.
        </Alert>
      }
      {activeVID &&
        <VideoPlayer vid={activeVID} tracks={trackData?.items[activeTrack]?.cues} />
      }
      {(hasTracks && trackData?.items.length) &&
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            >
            <Typography>Description Tracks ({trackData?.items.length})</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Cues</TableCell>
                    <TableCell>Updated</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {trackData.items.map((track, i) =>
                    <TableRow key={i}>
                      <TableCell>{JSON.parse(track.cues).length}</TableCell>
                      <TableCell>{new Date (Date.parse(track.updatedAt)).toDateString()}</TableCell>
                      <TableCell>
                        <Box sx={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 1,
                          }}>
                          <Button
                            onClick={() => handleSetActiveTrackClick(i)}
                            aria-pressed={activeTrack === i}
                            variant={activeTrack === i ? 'contained' : 'outlined'}
                            >
                            {activeTrack === i ? 'Active' : 'Set Active'}
                          </Button>
                          {(user && track.createdBy === user.attributes.sub) &&
                            <Button
                              variant="outlined"
                              onClick={() => handleDescribeClick(track.id)}
                              >
                              Edit
                            </Button>
                          }
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      }
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        }}>
        
        {requested ?
          <Button
            variant="outlined"
            size="small"
            >
            Requested
          </Button>
          :
          hasTracks ?
            <Button
              variant="contained"
              size="small"
              onClick={() => props.user ? handleRequestClick() : props.handleDialogOpen()}
              >
              Request a new description
            </Button>
            :
            <Button
              variant="contained"
              size="small"
              onClick={() => props.user ? handleRequestClick() : props.handleDialogOpen()}
              >
              Request a description
            </Button>
        }
        <Button
          variant="contained"
          size="small"
          onClick={() => props.user ? handleDescribeClick() : props.handleDialogOpen()}
          >
          Create a New Description
        </Button>
      </Box>
    </>
  )
}

export default Stage;