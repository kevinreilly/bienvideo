import styled from '@emotion/styled/macro';

import "@aws-amplify/ui-react/styles.css";
import {
  Button,
  withAuthenticator,
} from '@aws-amplify/ui-react';

import Notes from './Notes';
import VideoPlayer from "./VideoPlayer";

let sampleVideoId = "M7lc1UVf-VE";

const App = ({ signOut }) => {
  return (
    <StyledWrapper>
      <StyledAppBar as="header">
        <nav>
          <StyledButton onClick={signOut}>
            sign out
          </StyledButton>
        </nav>
      </StyledAppBar>
      <StyledMain>
        <VideoPlayer videoID={sampleVideoId} />
      </StyledMain>
      <StyledAppBar as="footer">
        <StyledButton
          as="a"
          href="https://www.buymeacoffee.com/kevinreilly"
          target="blank"
          >
            buy me a coffee
        </StyledButton>
      </StyledAppBar>
    </StyledWrapper>
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