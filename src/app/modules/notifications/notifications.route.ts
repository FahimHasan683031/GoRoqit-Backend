import express from 'express'
import auth from '../../middleware/auth'

import { NotificationController } from './notifications.controller'
import { USER_ROLES } from '../user/user.interface'

const router = express.Router()
router.get(
  '/',
  auth(USER_ROLES.APPLICANT, USER_ROLES.ADMIN, USER_ROLES.RECRUITER),
  NotificationController.getMyNotifications,
)
router.get('/:id', auth(USER_ROLES.APPLICANT, USER_ROLES.ADMIN, USER_ROLES.RECRUITER), NotificationController.updateNotification)
router.get('/all', auth(USER_ROLES.APPLICANT, USER_ROLES.ADMIN, USER_ROLES.RECRUITER), NotificationController.updateAllNotifications)
export const NotificationRoutes = router
