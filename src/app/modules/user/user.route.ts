import express from 'express'
import { UserController } from './user.controller'
import auth from '../../middleware/auth'
import { USER_ROLES } from '../../../enum/user'
import { fileAndBodyProcessorUsingDiskStorage } from '../../middleware/processReqBody'

const router = express.Router()

router.patch(
  '/profile',
  auth(USER_ROLES.APPLICANT, USER_ROLES.ADMIN, USER_ROLES.RECRUITER),
  fileAndBodyProcessorUsingDiskStorage(),
  UserController.updateProfile,
)
router.get(
  '/me',
  auth(USER_ROLES.APPLICANT, USER_ROLES.RECRUITER, USER_ROLES.ADMIN),
  UserController.getProfile,
)
router.get('/', auth(USER_ROLES.ADMIN), UserController.getAllUser),

  // get applicants
  router.get('/applicants', UserController.getApplicants)
// get current user
router.get(
  '/current-user',
  auth(USER_ROLES.APPLICANT, USER_ROLES.RECRUITER, USER_ROLES.ADMIN),
  UserController.getCurrentUser,
)
// get single user
router.get('/:id', UserController.getSingleUser)
// update user role and create profile

router.patch('/:id/role', UserController.updateUserRoleAndCreateProfile)
// delete user
router.delete('/:id', auth(USER_ROLES.ADMIN), UserController.deleteUser)

export const UserRoutes = router
