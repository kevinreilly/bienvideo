import {useState} from 'react';

import {
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material';

import {
  Search as SearchIcon,
} from '@mui/icons-material';

const Search = (props) => {

  const [search, setSearch] = useState('');

  const handleChange = (ev) => {
    setSearch(ev.target.value);
  }

  const handleKeyDown = (ev) => {
    if (ev.key === 'Enter') {
      props.handleSearch(search);
    }
  }

  return (
    <TextField
      size="small"
      label="Video URL"
      fullWidth
      value={search}
      onChange={handleChange}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              size="small">
              <SearchIcon fontSize="inherit" />
            </IconButton>
          </InputAdornment>
        )
      }}
      onKeyDown={handleKeyDown}
    />
  )
}

export default Search;