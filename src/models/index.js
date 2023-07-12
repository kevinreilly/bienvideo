// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Video, Track, Note } = initSchema(schema);

export {
  Video,
  Track,
  Note
};