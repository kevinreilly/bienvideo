import { Link } from "react-router-dom";

import styled from '@emotion/styled';

import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Button,
} from '@mui/material';

import {
  AccountCircle as AccountCircleIcon,
  Menu as MenuIcon,
  LocalPizza as LocalPizzaIcon,
} from '@mui/icons-material';

import Search from './Search';

const Header = (props) => {

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar sx={{gap: 2}}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={props.handleToggleDrawer}
          >
          <MenuIcon fontSize="inherit" />
        </IconButton>

        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            display: {
              xs: 'none',
              sm: 'block'
            }
          }}>
          <StyledLink to="/">
            BienVideo
          </StyledLink>
        </Typography>

        <Search />

        <IconButton
          edge="end"
          onClick={props.handleLoginClick}
          color={props.user ? 'success' : ''}
          aria-label={props.user ? 'sign out' : 'sign in/up'}
          >
          {props.user ? <AccountCircleIcon /> : <AccountCircleIcon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}

const StyledLink = styled(Link)`
  color: inherit;
  text-decoration: none;
`;

export default Header;