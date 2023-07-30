import { Box, Typography } from "@mui/material";

import VideoList from "./VideoList";

const Requests = () => {

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        p: 2,
        gap: 2,
      }}>
      <VideoList kind="requested" />
    </Box>
  )
}

export default Requests;