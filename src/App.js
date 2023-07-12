//react
import {useEffect, useMemo, useState} from 'react';

//aws
import { Amplify } from 'aws-amplify';
import "@aws-amplify/ui-react/styles.css";

import {
  Authenticator,
  defaultDarkModeOverride,
  ThemeProvider as AuthThemeProvider,
  useAuthenticator,
} from '@aws-amplify/ui-react';

import awsExports from './aws-exports';

//mui
import useMediaQuery from '@mui/material/useMediaQuery';

import {
  createTheme,
  ThemeProvider
} from '@mui/material/styles';

import {
  Box,
  CssBaseline,
  Dialog,
  Typography,
} from '@mui/material';

import Grid from '@mui/material/Unstable_Grid2';

//components
import Header from './Header';
import Home from './Home';
import Search from './Search';
import Stage from "./Stage";
import VideoList from "./VideoList";

Amplify.configure(awsExports);

const App = () => {

  const { user, signOut } = useAuthenticator((context) => [context.user]);

  const [activeVID, setActiveVID] = useState(null);

  const [dialogOpen, setDialogOpen] = useState(false);

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

  const authTheme = {
    name: 'auth-theme',
    overrides: [defaultDarkModeOverride],
  }

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if (urlParams.has('url')) {
      setActiveVID(youtubeURLParser(urlParams.get('url')));
      //setSearchField(urlParams.get('url'));
    }
  },[]);

  useEffect(() => {
    console.log(`activeVID`, activeVID);
  },[activeVID]);

  const youtubeURLParser = (url) => {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
  }

  const handleSearch = (query) => {
    setActiveVID(youtubeURLParser(query));
  }

  const handleDialogClose = () => {
    setDialogOpen(false);
  }

  const handleLoginClick = () => {
    user ? signOut() : setDialogOpen(true);
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <Header user={user} handleLoginClick={handleLoginClick} />
      <Box
        as="main"
        justifyContent="center"
        >
        <Grid container p={2} rowSpacing={2} width="100%">
          <Grid xs={12}>
            <Typography variant="h6" component="h1">Videos with Audio Descriptions</Typography>
          </Grid>
          <Grid xs={12}>
            <Search handleSearch={handleSearch} />
          </Grid>
        </Grid>
        {activeVID &&
          <Stage vid={activeVID} />
        }
        <VideoList handleSearch={handleSearch} />
      </Box>
      <Dialog onClose={handleDialogClose} open={dialogOpen}>
        <AuthThemeProvider theme={authTheme} colorMode="system">
          <Authenticator>
            {({ signOut, user }) => (
              <>
                <h1>Hello {user.username}</h1>
                <button onClick={signOut}>Sign out</button>
              </>
            )}
          </Authenticator>
        </AuthThemeProvider>
      </Dialog>
    </ThemeProvider>
  );
};

export default App;