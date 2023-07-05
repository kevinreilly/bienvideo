import {useMemo, useState} from 'react';

import styled from '@emotion/styled/macro';

import useMediaQuery from '@mui/material/useMediaQuery';
import {
  createTheme,
  ThemeProvider
} from '@mui/material/styles';

import {
  AppBar,
  Button,
  CssBaseline,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';

import Grid from '@mui/material/Unstable_Grid2';

import {
  LocalPizza as LocalPizzaIcon,
  Menu as MenuIcon,
  Search as SearchIcon
} from '@mui/icons-material';

import "@aws-amplify/ui-react/styles.css";
import {
  withAuthenticator,
} from '@aws-amplify/ui-react';

import VideoPlayer from "./VideoPlayer";

let sampleVideoId = "M7lc1UVf-VE";

const App = ({ signOut }) => {

  const [search, setSearch] = useState(null);

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

  const youtubeURLParser = (url) => {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
  }

  const handleSearchKeyDown = (ev) => {
    ev.key === 'Enter' && setSearch(youtubeURLParser(ev.target.value));
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <AppBar position="sticky">
        <Toolbar sx={{gap: 2}}>
          <IconButton
            size="small"
            edge="start"
            color="inherit"
            aria-label="menu"
            >
            <MenuIcon fontSize="inherit" />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            BienVideo
          </Typography>
          <IconButton
            size="small"
            href="https://www.buymeacoffee.com/kevinreilly"
            target="blank"
            color="inherit"
            aria-label="buy me a pizza"
            >
              <LocalPizzaIcon fontSize="inherit" />
          </IconButton>
          <Button
            onClick={signOut}
            size="small"
            color="inherit"
            >
            sign out
          </Button>
        </Toolbar>
      </AppBar>
      <Grid
        as="main"
        container
        justifyContent="center"
        >
        <Grid container p={2} gap={2} width="100%">
          {!search &&
            <Grid xs={12}>
              <Typography variant="h6" component="h1">Audio Descriptions for YouTube Videos</Typography>
            </Grid>
          }
          <Grid xs={12}>
            <TextField
              size="small"
              label="Video URL"
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small">
                      <SearchIcon fontSize="inherit" />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              onKeyDown={handleSearchKeyDown}
            />
          </Grid>
        </Grid>
        {search &&
          <VideoPlayer videoID={search} />
        }
      </Grid>
    </ThemeProvider>
  );
};

const StyledWrapper = styled.div`
  --theme: turquoise;
  --background: #fff;
  --color: #333;
  @media (prefers-color-scheme: dark) {
    --theme: #111;
    --background: #333;
    --color: #fff;
  }
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: monospace;
  background: var(--background);
  color: var(--color);
`;

const StyledMain = styled.main`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
`;

const StyledAppBar = styled.div`
  background: var(--theme);
  min-height: 2rem;
  display: flex;
  vertical-align: middle;
  justify-content: end;
  padding: 0.5rem;
`;

const StyledButton = styled.button`
  appearance: none;
  background: var(--background);
  border: 0.125rem solid var(--color);
  border-radius: 0.25rem;
  font-weight: bold;
  color: var(--color);
  text-decoration: none;
  padding: 0.25rem 0.5rem;
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
  &:hover {
    opacity: 0.875;
  }
`;

export default withAuthenticator(App);