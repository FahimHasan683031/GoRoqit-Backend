import express from 'express'
import validateRequest from '../../middleware/validateRequest'
import auth from '../../middleware/auth'
import { USER_ROLES } from '../../../enum/user'
import {
  fileAndBodyProcessorUsingDiskStorage,
} from '../../middleware/processReqBody'
import { profileValidations } from './profile.validation'
import { profileControllers } from './profile.controller'

const router = express.Router()

router.post(
  '/',
  auth(
    USER_ROLES.APPLICANT,
    USER_ROLES.ADMIN,
    USER_ROLES.RECRUITER,
  ),
  fileAndBodyProcessorUsingDiskStorage(),
  validateRequest(profileValidations.createProfile),
  profileControllers.createProfile,
)

router.get(
  '/all',
  auth(
    USER_ROLES.APPLICANT,
    USER_ROLES.ADMIN,
    USER_ROLES.RECRUITER,
  ),
  profileControllers.getAllProfile,
),

router.get(
  '/',
  auth(
    USER_ROLES.APPLICANT,
    USER_ROLES.ADMIN,
    USER_ROLES.RECRUITER,
  ),
  profileControllers.getProfile,
)

export const ProfileRoutes = router;


