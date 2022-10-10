import { Entity, Schema } from 'redis-om'
import client from './client.js'

/* our entity */
class Dog extends Entity {}

/* create a Schema for Dog */
const dogSchema = new Schema(Dog, {
  breed: { type: 'string' },
  description: { type: 'text' },
  pictureURL: { type: 'string' },
  height: { type: 'number' },
  weight: { type: 'number' },
  lifeSpan: { type: 'number' },
  breedCharacteristics: { type: 'string[]' }
})

/* use the client to create a Repository just for Dogs */
export const dogRepository = client.fetchRepository(dogSchema)

/* create the index for Dog */
await dogRepository.createIndex()
