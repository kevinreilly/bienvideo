/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateNote = /* GraphQL */ `
  subscription OnCreateNote($filter: ModelSubscriptionNoteFilterInput) {
    onCreateNote(filter: $filter) {
      id
      name
      description
      image
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateNote = /* GraphQL */ `
  subscription OnUpdateNote($filter: ModelSubscriptionNoteFilterInput) {
    onUpdateNote(filter: $filter) {
      id
      name
      description
      image
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteNote = /* GraphQL */ `
  subscription OnDeleteNote($filter: ModelSubscriptionNoteFilterInput) {
    onDeleteNote(filter: $filter) {
      id
      name
      description
      image
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateTracks = /* GraphQL */ `
  subscription OnCreateTracks(
    $filter: ModelSubscriptionTracksFilterInput
    $owner: String
  ) {
    onCreateTracks(filter: $filter, owner: $owner) {
      id
      language
      cues
      videoID
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onUpdateTracks = /* GraphQL */ `
  subscription OnUpdateTracks(
    $filter: ModelSubscriptionTracksFilterInput
    $owner: String
  ) {
    onUpdateTracks(filter: $filter, owner: $owner) {
      id
      language
      cues
      videoID
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onDeleteTracks = /* GraphQL */ `
  subscription OnDeleteTracks(
    $filter: ModelSubscriptionTracksFilterInput
    $owner: String
  ) {
    onDeleteTracks(filter: $filter, owner: $owner) {
      id
      language
      cues
      videoID
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onCreateVideo = /* GraphQL */ `
  subscription OnCreateVideo(
    $filter: ModelSubscriptionVideoFilterInput
    $owner: String
  ) {
    onCreateVideo(filter: $filter, owner: $owner) {
      id
      Tracks {
        items {
          id
          language
          cues
          videoID
          createdAt
          updatedAt
          owner
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onUpdateVideo = /* GraphQL */ `
  subscription OnUpdateVideo(
    $filter: ModelSubscriptionVideoFilterInput
    $owner: String
  ) {
    onUpdateVideo(filter: $filter, owner: $owner) {
      id
      Tracks {
        items {
          id
          language
          cues
          videoID
          createdAt
          updatedAt
          owner
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onDeleteVideo = /* GraphQL */ `
  subscription OnDeleteVideo(
    $filter: ModelSubscriptionVideoFilterInput
    $owner: String
  ) {
    onDeleteVideo(filter: $filter, owner: $owner) {
      id
      Tracks {
        items {
          id
          language
          cues
          videoID
          createdAt
          updatedAt
          owner
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
