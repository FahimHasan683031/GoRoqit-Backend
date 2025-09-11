import express from 'express'
import { UserController } from './user.controller'
import validateRequest from '../../middleware/validateRequest'
import auth from '../../middleware/auth'
import { USER_ROLES } from '../../../enum/user'
import {
  fileAndBodyProcessorUsingDiskStorage,
} from '../../middleware/processReqBody'
import { UserValidations } from './user.validation'

const router = express.Router()


router.patch(
  '/profile',
  auth(
    USER_ROLES.APPLICANT,
    USER_ROLES.ADMIN,
    USER_ROLES.RECRUITER,
  ),
  fileAndBodyProcessorUsingDiskStorage(),
  validateRequest(UserValidations.userUpdateSchema),
  UserController.updateProfile,
)
router.get('/',UserController.getAllUser),
// get single user
router.get('/:id',UserController.getSingleUser)
// delete user
router.delete('/:id',UserController.deleteUser)

export const UserRoutes = router
