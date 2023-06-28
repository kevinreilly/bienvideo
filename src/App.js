import VideoPlayer from './VideoPlayer';

import "@aws-amplify/ui-react/styles.css";
import {
  withAuthenticator,
  Button,
  Heading,
  Image,
  View,
  Card,
} from "@aws-amplify/ui-react";

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

const App = ({ signOut }) => {
  return (
    <View className="App">
      <Card>
        <Heading level={1}>We now have Auth!</Heading>
      </Card>
      <Button onClick={signOut}>Sign Out</Button>
      <VideoPlayer videoID="M7lc1UVf-VE" cues={cues} />
    </View>
  );
}

export default withAuthenticator(App);
