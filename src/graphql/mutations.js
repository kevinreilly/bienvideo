/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const deleteVideo = /* GraphQL */ `
  mutation DeleteVideo(
    $input: DeleteVideoInput!
    $condition: ModelVideoConditionInput
  ) {
    deleteVideo(input: $input, condition: $condition) {
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
export const createNote = /* GraphQL */ `
  mutation CreateNote(
    $input: CreateNoteInput!
    $condition: ModelNoteConditionInput
  ) {
    createNote(input: $input, condition: $condition) {
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
export const updateNote = /* GraphQL */ `
  mutation UpdateNote(
    $input: UpdateNoteInput!
    $condition: ModelNoteConditionInput
  ) {
    updateNote(input: $input, condition: $condition) {
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
export const deleteNote = /* GraphQL */ `
  mutation DeleteNote(
    $input: DeleteNoteInput!
    $condition: ModelNoteConditionInput
  ) {
    deleteNote(input: $input, condition: $condition) {
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
export const createTracks = /* GraphQL */ `
  mutation CreateTracks(
    $input: CreateTracksInput!
    $condition: ModelTracksConditionInput
  ) {
    createTracks(input: $input, condition: $condition) {
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
export const updateTracks = /* GraphQL */ `
  mutation UpdateTracks(
    $input: UpdateTracksInput!
    $condition: ModelTracksConditionInput
  ) {
    updateTracks(input: $input, condition: $condition) {
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
export const deleteTracks = /* GraphQL */ `
  mutation DeleteTracks(
    $input: DeleteTracksInput!
    $condition: ModelTracksConditionInput
  ) {
    deleteTracks(input: $input, condition: $condition) {
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
export const createVideo = /* GraphQL */ `
  mutation CreateVideo(
    $input: CreateVideoInput!
    $condition: ModelVideoConditionInput
  ) {
    createVideo(input: $input, condition: $condition) {
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
export const updateVideo = /* GraphQL */ `
  mutation UpdateVideo(
    $input: UpdateVideoInput!
    $condition: ModelVideoConditionInput
  ) {
    updateVideo(input: $input, condition: $condition) {
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
