import { createSearchParams, useNavigate } from 'react-router-dom';

import styled from '@emotion/styled';

import {
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material';

import {
  Search as SearchIcon,
} from '@mui/icons-material';

const Search = () => {

  const navigate = useNavigate();

  const handleSubmit = (ev) => {
    ev.preventDefault();
    let formData = new FormData(ev.currentTarget);
    let newURL = formData.get("url");
    if (!newURL) return;

    navigate({
      pathname: '/watch',
      search: `?${createSearchParams({url: newURL})}`
    });
  }

  return (
    <StyledForm onSubmit={handleSubmit}>
      <TextField
        name="url"
        size="small"
        aria-label="search"
        placeholder="Video URL"
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
                <SearchIcon />
            </InputAdornment>
          )
        }}
      />
    </StyledForm>
    
  )
}

const StyledForm = styled.form`
  transition: 0.25s;
  &:focus-within {
    flex-grow: 1;
  }
`;

export default Search;