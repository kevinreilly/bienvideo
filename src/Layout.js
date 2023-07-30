//react
import {useEffect, useState} from 'react';

//router
import { Outlet, Link, useNavigate, useSearchParams } from "react-router-dom";

//aws
import "@aws-amplify/ui-react/styles.css";

import {
  Authenticator,
  defaultDarkModeOverride,
  ThemeProvider as AuthThemeProvider,
  useAuthenticator,
} from '@aws-amplify/ui-react';

import {
  Box,
  Dialog,
  Drawer,
  List,
  ListItem,
} from '@mui/material';

import { youtubeURLParser } from './utils';

//components
import Header from './Header';

const Layout = () => {

  const { user, signOut } = useAuthenticator((context) => [context.user]);

  const [view, setView] = useState(null);

  const [activeVID, setActiveVID] = useState(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  let [searchParams, setSearchParams] = useSearchParams();

  const authTheme = {
    name: 'auth-theme',
    overrides: [defaultDarkModeOverride],
  }

  useEffect(() => {
    setActiveVID(searchParams.size ? youtubeURLParser(searchParams.get('url')) : null);
  },[searchParams]);

  useEffect(() => {
    user && setDialogOpen(false);
    console.log(user);
  },[user]);

  useEffect(() => {
    console.log(`activeVID`, activeVID);
  },[activeVID]);

  const handleSearch = (query) => {
    setActiveVID(youtubeURLParser(query));
  }

  const handleDialogClose = () => {
    setDialogOpen(false);
  }

  const handleDialogOpen = () => {
    setDialogOpen(true);
  }

  const handleToggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  }

  const handleLoginClick = () => {
    if (user) {
      signOut();
      view === 'edit' && setView(null);
    } else {
      setDialogOpen(true);
    }
  }

  const handleChangeView = (newView) => {
    setView(newView);
  }

  return (
    <>
      <Header
        user={user}
        handleLoginClick={handleLoginClick}
        handleToggleDrawer={handleToggleDrawer}
        handleChangeView={handleChangeView}
      />
      
      <main>
        <Outlet context={{
          handleChangeView: handleChangeView,
          handleSearch: handleSearch,
          activeVID: activeVID,
          handleDialogOpen: handleDialogOpen,
          user: user,
        }} />
      </main>

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

      <Drawer
        open={drawerOpen}
        onClose={handleToggleDrawer}
        >

          <Box
            sx={{ width: '15em' }}
            role="presentation"
            onClick={handleToggleDrawer}
            onKeyDown={handleToggleDrawer}
            >

            <List sx={{p: 2}}>
              <ListItem disablePadding>
                <Link to="/">Home</Link>
              </ListItem>
              <ListItem disablePadding>
                <Link to="/requests">Requests</Link>
              </ListItem>
              <ListItem disablePadding>
                <Link to="/about">About</Link>
              </ListItem>
            </List>
          </Box>
      </Drawer>
    </>
  );
}

export default Layout;