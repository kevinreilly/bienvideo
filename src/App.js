//react
import {useMemo} from 'react';

//router
import { Routes, Route, Link } from "react-router-dom";

//aws
import { Amplify } from 'aws-amplify';
import "@aws-amplify/ui-react/styles.css";

import awsExports from './aws-exports';

//mui
import useMediaQuery from '@mui/material/useMediaQuery';

import {
  createTheme,
  ThemeProvider
} from '@mui/material/styles';

import {
  CssBaseline,
} from '@mui/material';

//components
import Layout from './Layout';
import Home from './Home';
import Requests from './Requests';
import Watch from './Watch';
import TrackEditor from './TrackEditor';
import About from './About';

Amplify.configure(awsExports);

const App = () => {

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

  return (
    <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />

        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="requests" element={<Requests />} />
            <Route path="watch" element={<Watch />} />
            <Route path="create" element={<TrackEditor />} />
            <Route path="about" element={<About />} />

            {/* Using path="*"" means "match anything", so this route
                  acts like a catch-all for URLs that we don't have explicit
                  routes for. */}
            <Route path="*" element={<NoMatch />} />
          </Route>
        </Routes>

    </ThemeProvider>
  );
};

const NoMatch = () => {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}


export default App;