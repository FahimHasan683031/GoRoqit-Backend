import express from 'express'
import { DashboardControllers } from './dashboard.controller'
import auth from '../../middleware/auth'
import { USER_ROLES } from '../user/user.interface'

const router = express.Router()

router.get(
  '/statistics',
  auth(USER_ROLES.ADMIN),
  DashboardControllers.getDashboardStatistics,
)
router.get(
  '/recruter-statistics',
  auth(USER_ROLES.RECRUITER),
  DashboardControllers.rectuterStatistics,
)
router.get(
  '/home-page-statistics',
  DashboardControllers.homePageStatistics,
)

export const DashboardRoutes = router
