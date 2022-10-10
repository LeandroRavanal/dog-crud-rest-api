import { Router } from 'express'
import { checkSchema, validationResult } from 'express-validator';
import { dogRepository } from '../om/dog.js'

export const router = Router()

const breedCharacteristics = [
  'adaptability', 
  'potential for weight gain', 
  'kid-friendly', 
  'easy-to-train', 
  'adapts well to apartment living'
]

const idValidationSchema = {
  id: { in: 'params', isAlphanumeric: true, isUppercase: true, isLength: { options: { min: 26, max: 26 } } }  
}

const dogValidationSchema = {
  breed: { in: 'body', isLength: { options: { max: 30 } }, isEmpty: { negated: true, options: { ignore_whitespace: true } }, trim: {} },
  description: { in: 'body', isEmpty: { negated: true, options: { ignore_whitespace: true } }, trim: {}, escape: {} },
  pictureURL: { in: 'body', isURL: true },
  height: { in: 'body', isInt: { options: { gt: 0 } } },
  weight: { in: 'body', isInt: { options: { gt: 0 } } },
  lifeSpan: { in: 'body', isInt: { options: { gt: 0, lt: 25 } } },
  breedCharacteristics: { in: 'body', isArray: true, custom: {
      options: (values, { req, location, path }) => {
        const errors = values.filter(value => !breedCharacteristics.includes(value))
        if (errors.length)
          throw new Error('Breed chars contains invalid value(s): ' + errors.join(', '))
        return true;
      } 
    } 
  }
}

const res404Msg = function(req) { return `Dog with ID=${req.params.id} was not found` }

router.put('/', checkSchema (dogValidationSchema), async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }    
    
    const dog = await dogRepository.createAndSave(req.body)
    res.send(dog)
})

router.get('/:id', checkSchema (idValidationSchema), async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const dog = await dogRepository.fetch(req.params.id)
  if (dog.breed == null) {
    return res.status(404).json({ msg: res404Msg(req) })
  }
  
  res.send(dog)
})

router.post('/:id', checkSchema (idValidationSchema), checkSchema (dogValidationSchema), async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  } 

  const dog = await dogRepository.fetch(req.params.id)
  if (dog.breed == null) {
    return res.status(404).json({ msg: res404Msg(req) })
  }

  dog.breed = req.body.breed ?? null
  dog.description = req.body.description ?? null
  dog.pictureURL = req.body.pictureURL ?? null
  dog.height = req.body.height ?? null
  dog.weight = req.body.weight ?? null
  dog.lifeSpan = req.body.lifeSpan ?? null
  dog.breedCharacteristics = dog.breedCharacteristics ?? null

  await dogRepository.save(dog)
  res.send(dog)
})

router.delete('/:id', checkSchema (idValidationSchema), async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const dog = await dogRepository.fetch(req.params.id)
  if (dog.breed == null) {
    return res.status(404).json({ msg: res404Msg(req) })
  }

  await dogRepository.remove(req.params.id)
  res.send({ entityId: req.params.id })
})
