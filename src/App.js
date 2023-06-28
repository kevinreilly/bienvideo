import VideoPlayer from './VideoPlayer';

import './App.css';

let cues = [
  {
    start: 2,
    end: 8,
    text: 'this is a test',
  },
  {
    start: 10,
    end: 16,
    text: 'this is another test',
  }
]

const App = () => {
  return (
    <VideoPlayer videoID="M7lc1UVf-VE" cues={cues} />
  );
}

export default App;
