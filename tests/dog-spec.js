import chai from 'chai'
import sinonChai from 'sinon-chai'

import { expect } from 'chai'
import { createSandbox } from 'sinon'

import request from 'supertest'

import { app } from '../server.js'
import { dogRepository } from '../om/dog.js'
import { dogValidations } from '../routers/dog-router.js'

chai.use(sinonChai)

const sandbox = createSandbox()

describe('Testing express app routes', () => {

  afterEach(() => {
    sandbox.restore()
  })

  describe('Testing /dog route', () => {
    let entityId, sampleDog, sampleDogWithId, breedCharacteristicsStub

    const breedChars = [
      'adaptability', 
      'potential for weight gain', 
      'kid-friendly', 
      'easy-to-train', 
      'adapts well to apartment living'
    ]

    beforeEach(() => {
      entityId = '01FX8N39YVZRCQNAW0R5T53H5T'
      sampleDog = {
        breed: 'Akita',
        description: 'The Akita is a muscular, double-coated dog of ancient Japanese lineage famous for their dignity, courage, and loyalty.',
        pictureURL: 'http://images.com/akita',
        height: 26,
        weight: 100,
        lifeSpan: 10,
        breedCharacteristics: [ 'adaptability', 'easy-to-train' ]
      }
      sampleDogWithId = {
        ...sampleDog,
        id: entityId
      }
      sandbox.stub(dogRepository, 'createAndSave').resolves(sampleDogWithId)
      sandbox.stub(dogRepository, 'fetch').resolves(sampleDogWithId)
      sandbox.stub(dogRepository, 'save')
      sandbox.stub(dogRepository, 'remove')

      sandbox.stub(dogValidations, 'breedCharacteristics').resolves(breedChars)
    })

    it('PUT / should successfully create a new dog', (done) => {
      request(app).put('/dog/')
        .send(sampleDog)
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('id').to.equal(entityId)
          expect(res.body).to.have.property('breed').to.equal(sampleDog.breed)
          expect(res.body).to.have.property('description').to.equal(sampleDog.description)
          expect(res.body).to.have.property('pictureURL').to.equal(sampleDog.pictureURL)
          expect(res.body).to.have.property('height').to.equal(sampleDog.height)
          expect(res.body).to.have.property('weight').to.equal(sampleDog.weight)
          expect(res.body).to.have.property('lifeSpan').to.equal(sampleDog.lifeSpan)
          expect(res.body).to.have.property('breedCharacteristics').to.have.deep.members(sampleDog.breedCharacteristics)
          done(err)
      })
    })
    
    it('GET /:id should successfully return a dog', (done) => {
      request(app).get(`/dog/${entityId}`)
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('id').to.equal(entityId)
          expect(res.body).to.have.property('breed').to.equal(sampleDog.breed)
          expect(res.body).to.have.property('description').to.equal(sampleDog.description)
          expect(res.body).to.have.property('pictureURL').to.equal(sampleDog.pictureURL)
          expect(res.body).to.have.property('height').to.equal(sampleDog.height)
          expect(res.body).to.have.property('weight').to.equal(sampleDog.weight)
          expect(res.body).to.have.property('lifeSpan').to.equal(sampleDog.lifeSpan)
          expect(res.body).to.have.property('breedCharacteristics').to.have.deep.members(sampleDog.breedCharacteristics)
          done(err)
      })
    })

    it('POST /:id should successfully update breed for a given dog', (done) => {
      let customDog = {
        ...sampleDog,
        breed: 'beagle'
      }
      request(app).post(`/dog/${entityId}`)
        .send(customDog)
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('id').to.equal(entityId)
          expect(res.body).to.have.property('breed').to.equal(customDog.breed)
          expect(res.body).to.have.property('description').to.equal(customDog.description)
          expect(res.body).to.have.property('pictureURL').to.equal(customDog.pictureURL)
          expect(res.body).to.have.property('height').to.equal(customDog.height)
          expect(res.body).to.have.property('weight').to.equal(customDog.weight)
          expect(res.body).to.have.property('lifeSpan').to.equal(customDog.lifeSpan)
          expect(res.body).to.have.property('breedCharacteristics').to.have.deep.members(customDog.breedCharacteristics)
          done(err)
      })
    })    
  })

})
