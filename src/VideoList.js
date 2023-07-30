import React, {useEffect, useRef, useState} from 'react';
import { createSearchParams, useSearchParams, useNavigate } from "react-router-dom";

import styled from '@emotion/styled';

import { API } from 'aws-amplify';

import {
  listVideos,
  videosByVid,
} from "./graphql/queries";

import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material';

import Grid from '@mui/material/Unstable_Grid2/Grid2';

import {
  GridView as GridViewIcon,
  ViewList as ViewListIcon,
} from '@mui/icons-material';

const VideoItem = (props) => {

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [videoData, setVideoData] = useState(null);
  const [tags, setTags] = useState(null);

  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const vidurl = `https://www.youtube.com/watch?v=${props.data.vid}`;

    fetch(`https://noembed.com/embed?dataType=json&url=${vidurl}`)
      .then(res => res.json())
      .then(data => setVideoData({
        url: data.url,
        title: data.title,
        author_name: data.author_name,
        thumbnail_url: data.thumbnail_url
      }));

      fetchVideo(props.data.vid);
  },[]);

  async function fetchVideo(id) {
    const apiData = await API.graphql({
      query: videosByVid,
      variables: {vid: id},
    });
    setTags(apiData.data.videosByVid.items[0].tags);
    setRequests(apiData.data.videosByVid.items[0].requests);
  }

  const handleVideoClick = (url) => {
    navigate({
      pathname: '/watch',
      search: `?${createSearchParams({url: url})}`
    });
  }

  return (
    videoData &&
      <Card variant="outlined" sx={{height: '100%'}}>
        <CardActionArea
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start',
            justifyContent: 'start',
          }}
          //aria-label={`${videoData.title} - ${videoData.author_name} -${tags.map((tag) => ` ${tag}`)}`}
          onClick={() => handleVideoClick(videoData.url)}
          >
          {props.layout === 'grid' &&
            <CardMedia
              component="img"
              height="140"
              image={videoData.thumbnail_url}
            />
          }
          <CardContent sx={{
            display: 'flex',
            flexDirection: props.layout === 'grid' ? 'column' : 'row',
            justifyContent: 'space-between',
            flexGrow: 1,
            gap: 1,
            width: '100%',
            }}>
            <Stack
              //direction={props.layout === 'grid' ? 'column' : 'row'}
              sx={{flexDirection: {sm: props.layout !== 'grid' && 'row'}, gap: 1}}
              //spacing={1}
              alignItems="baseline">
              <Typography
                gutterBottom
                variant="body1"
                component="h3"
                m={0}
                id={`article-title-${props.index}`}
                >
                <StyledVideoTitle>
                  {videoData.title}
                </StyledVideoTitle>
              </Typography>
              <Typography
                gutterBottom
                variant="body2"
                color="text.secondary"
                id={`article-desc-${props.index}`}
                >
                {videoData.author_name}
              </Typography>
            </Stack>
            {(props.kind !== 'described' && props.data.requests?.length) &&
              <Box>
                <Chip
                  size="small"
                  variant="outlined"
                  label={`${props.data.requests.length} request${props.data.requests.length > 1 ? 's' : ''}`}
                />
              </Box>
            }
          </CardContent>
        </CardActionArea>
      </Card>      
  )
}

const VideoList = (props) => {

  const bottomRef = useRef(null);

  const [atBottom, setAtBottom] = useState(false);

  const [videos, setVideos] = useState([]);

  const [nextToken, setNextToken] = useState(null);

  const [layout, setLayout] = useState('grid');

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setAtBottom(true);
      } else {
        setAtBottom(false);
      }
    });
    observer.observe(bottomRef.current);
  }, []);

  useEffect(() => {
    atBottom && fetchMoreVideos();
  },[atBottom]);

  async function fetchVideos() {
    let filter = props.kind === 'described' ? {tags: {contains: 'described'}} : {requests: {size: {gt: 0}}};

    const apiData = await API.graphql({
      query: listVideos,
      variables: {
        limit: 12,
        filter: filter
      }
    });
    setNextToken(apiData.data.listVideos.nextToken);
    const videosFromAPI = apiData.data.listVideos.items;
    await Promise.all(
      videosFromAPI.map(async (video) => {
        return video;
      })
    );
    setVideos([...videos, ...videosFromAPI]);
  }

  async function fetchMoreVideos() {
    let filter = props.kind === 'described' ? {tags: {contains: 'described'}} : {requests: {size: {gt: 0}}};
    
    const apiData = await API.graphql({
      query: listVideos,
      variables: {
        limit: 12,
        filter: filter,
        nextToken: nextToken,
      }
    });
    setNextToken(apiData.data.listVideos.nextToken);
    const videosFromAPI = apiData.data.listVideos.items;
    await Promise.all(
      videosFromAPI.map(async (video) => {
        return video;
      })
    );
    setVideos([...videos, ...videosFromAPI]);
  }

  useEffect(() => {
    console.log(videos);
  },[videos]);

  const handleLayoutChange = (event, newLayout) => {
    setLayout(newLayout);
  };

  const gridColumnSizes = layout === 'grid' ? {
    sm: 6,
    md: 4,
    lg: 3,
    xl: 2
  } : {};

  return (
    <Stack spacing={4}>
      <Stack spacing={2} useFlexGap>

        <Stack spacing={1} direction="row" alignItems="center" justifyContent="space-between">
          <Typography component="h2" variant="h6">Recently {props.kind}</Typography>
          <ToggleButtonGroup
            value={layout}
            exclusive
            onChange={handleLayoutChange}
            aria-label="toggle layout"
            size="small"
            >
            <ToggleButton value="grid" aria-label="grid">
              <GridViewIcon />
            </ToggleButton>
            <ToggleButton value="list" aria-label="list">
              <ViewListIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
        
        <Grid container spacing={2} role="feed">
          {videos.map((video, i) =>
            <Grid
              key={i}
              xs={12}
              {...gridColumnSizes}
              role="article"
              aria-posinset={i}
              aria-setsize={videos.length}
              //aria-labelledby={`article-title-${i}`}
              //aria-describedby={`article-desc-${i}`}
              >
              <VideoItem
                index={i}
                data={video}
                layout={layout}
                kind={props.kind}
              />
            </Grid>
          )}
        </Grid>
      </Stack>
      <div ref={bottomRef}></div>
    </Stack>
  )
}

const StyledVideoTitle = styled.span`
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

VideoList.propTypes = {};

export default VideoList;