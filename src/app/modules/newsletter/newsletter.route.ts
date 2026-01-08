import express from 'express'
import { newsletterController } from './newsletter.controller'
import auth from '../../middleware/auth'
import { USER_ROLES } from '../user/user.interface'

const router = express.Router()

router.post('/', newsletterController.createNewsletter)
router.get('/', auth(USER_ROLES.ADMIN), newsletterController.getAllNewsletters)
router.delete('/all', newsletterController.deleteAllNewsletters)
router.delete('/:id', newsletterController.deleteNewsletter)

export const newsletterRoutes = router
