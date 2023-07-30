import { useOutletContext } from "react-router-dom";

import {
  Box,
} from "@mui/material";

import Stage from "./Stage";
import VideoList from "./VideoList";

const Watch = () => {

  const {
    handleChangeView,
    handleDialogOpen,
    user,
  } = useOutletContext();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        p: 2,
        gap: 2,
      }}>
      <Stage
        handleChangeView={handleChangeView}
        handleDialogOpen={handleDialogOpen}
        user={user}
      />
      <VideoList kind="described" />
    </Box>
  )
}

export default Watch;