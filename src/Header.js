import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
} from '@mui/material';

import {
  Menu as MenuIcon,
  LocalPizza as LocalPizzaIcon,
} from '@mui/icons-material';

const Header = (props) => {
  return (
    <AppBar position="sticky" elevation={0}>
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
          onClick={props.handleLoginClick}
          size="small"
          color="inherit"
          >
          {props.user ? 'sign out' : 'sign in/up'}
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default Header;