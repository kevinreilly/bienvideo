// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Track, Note } = initSchema(schema);

export {
  Track,
  Note
};