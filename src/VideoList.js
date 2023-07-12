import {useEffect, useState} from 'react';
import PropTypes, { array } from 'prop-types';

import styled from '@emotion/styled';

import { API } from 'aws-amplify';

import {
  listVideos,
  videosByVid,
} from "./graphql/queries";

import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Typography
} from '@mui/material';

import Grid from '@mui/material/Unstable_Grid2';

const VideoItem = (props) => {

  const [videoData, setVideoData] = useState(null);
  const [tags, setTags] = useState(null);

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

      fetchVideo(props.data.vid)
  },[]);

  async function fetchVideo(id) {
    const apiData = await API.graphql({
      query: videosByVid,
      variables: {vid: id},
    });
    //const videoData = apiData.data.videosByVid;
    //setVideoData(videoData);
    setTags(apiData.data.videosByVid.items[0].tags);
  }

  return (
    videoData &&
      <Card variant="outlined" sx={{height: '100%'}}>
        <CardActionArea
          aria-label={`${videoData.title} - ${videoData.author_name}`}
          onClick={() => props.handleSearch(videoData.url)}
          >
          <CardMedia
            component="img"
            height="140"
            image={videoData.thumbnail_url}
          />
          <CardContent>
            <Typography
              gutterBottom
              variant="body1"
              component="h3"
              >
              <StyledVideoTitle>
                {videoData.title}
              </StyledVideoTitle>
            </Typography>
            <Typography gutterBottom variant="body2" color="text.secondary">
              {videoData.author_name}
            </Typography>
            {tags?.map((tag, i) =>
              <Chip
                key={i}
                size="small"
                variant="outlined"
                label={tag}
              />
            )}
          </CardContent>
        </CardActionArea>
      </Card>      
  )
}

const VideoList = (props) => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetchVideos();
  }, []);

  async function fetchVideos() {
    const apiData = await API.graphql({ query: listVideos });
    const videosFromAPI = apiData.data.listVideos.items;
    await Promise.all(
      videosFromAPI.map(async (video) => {
        return video;
      })
    );
    setVideos(videosFromAPI);
  }

  return (
    <Grid container p={2} spacing={2} component="section">
      {videos.map((video, i) =>
        <Grid
          key={i} 
          xs={12} sm={6} md={4} lg={3} xl={2}
          component="article"
          >
          <VideoItem
            data={video}
            handleSearch={props.handleSearch}
          />
        </Grid>
      )}
    </Grid>
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