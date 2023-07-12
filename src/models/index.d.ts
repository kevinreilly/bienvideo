import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection } from "@aws-amplify/datastore";





type EagerVideo = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Video, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly vid: string;
  readonly tags?: (string | null)[] | null;
  readonly Tracks?: (Track | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyVideo = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Video, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly vid: string;
  readonly tags?: (string | null)[] | null;
  readonly Tracks: AsyncCollection<Track>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Video = LazyLoading extends LazyLoadingDisabled ? EagerVideo : LazyVideo

export declare const Video: (new (init: ModelInit<Video>) => Video) & {
  copyOf(source: Video, mutator: (draft: MutableModel<Video>) => MutableModel<Video> | void): Video;
}

type EagerTrack = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Track, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly cues?: string[] | null;
  readonly videoID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyTrack = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Track, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly cues?: string[] | null;
  readonly videoID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Track = LazyLoading extends LazyLoadingDisabled ? EagerTrack : LazyTrack

export declare const Track: (new (init: ModelInit<Track>) => Track) & {
  copyOf(source: Track, mutator: (draft: MutableModel<Track>) => MutableModel<Track> | void): Track;
}

type EagerNote = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Note, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly description?: string | null;
  readonly image?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyNote = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Note, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly description?: string | null;
  readonly image?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Note = LazyLoading extends LazyLoadingDisabled ? EagerNote : LazyNote

export declare const Note: (new (init: ModelInit<Note>) => Note) & {
  copyOf(source: Note, mutator: (draft: MutableModel<Note>) => MutableModel<Note> | void): Note;
}