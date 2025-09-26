import express from 'express'
import { UserController } from './user.controller'
import validateRequest from '../../middleware/validateRequest'
import auth from '../../middleware/auth'
import { USER_ROLES } from '../../../enum/user'
import {
  fileAndBodyProcessorUsingDiskStorage,
} from '../../middleware/processReqBody'
import { UserValidations } from './user.validation'
import { validateProfileUpdate } from '../../middleware/profileValication'
import { RecruiterProfileUpdateSchema } from '../recruiterProfile/recruiterProfile.validation'


const router = express.Router()


router.patch(
  '/profile',
  auth(
    USER_ROLES.APPLICANT,
    USER_ROLES.ADMIN,
    USER_ROLES.RECRUITER,
  ),
  fileAndBodyProcessorUsingDiskStorage(),
  // validateProfileUpdate,
  // validateRequest(RecruiterProfileUpdateSchema),
  UserController.updateProfile,
)
router.get('/me', auth(USER_ROLES.APPLICANT, USER_ROLES.RECRUITER), UserController.getProfile)
router.get('/',UserController.getAllUser),
// get single user
router.get('/:id',UserController.getSingleUser)
// update user role and create profile


router.patch(
  '/:id/role',
  UserController.updateUserRoleAndCreateProfile,

)
// delete user
router.delete('/:id',UserController.deleteUser)

export const UserRoutes = router
