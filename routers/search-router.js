import { Router } from 'express'
import { param, validationResult } from 'express-validator';
import { dogRepository } from '../om/dog.js'

export const router = Router()

router.get('/all', async (req, res, next) => {
    const dogs = await dogRepository.search().return.all()
    res.send(dogs)
})

router.get('/by-breed/:breed', param('breed').isLength({ max: 30 }).notEmpty().trim(), async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const breed = req.params.breed
    const dogs = await dogRepository.search().where('breed').equals(breed).return.all()
    res.send(dogs)
})

router.get('/with-description-containing/:text', param('text').isLength({ max: 30 }).notEmpty().trim().escape(), async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const text = req.params.text
    const dogs = await personRepository.search().where('description').matches(text).return.all()
    res.send(dogs)
})
