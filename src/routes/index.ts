
import { UserRoutes } from '../app/modules/user/user.route'
import { AuthRoutes } from '../app/modules/auth/auth.route'
import express, { Router } from 'express'
import { NotificationRoutes } from '../app/modules/notifications/notifications.route'
import { PublicRoutes } from '../app/modules/public/public.route'
import { JobRoutes } from '../app/modules/job/job.route'
import { ApplicationRoutes } from '../app/modules/applicant/application.route'


const router = express.Router()

const apiRoutes: { path: string; route: Router }[] = [
  { path: '/user', route: UserRoutes },
  { path: '/auth', route: AuthRoutes },


  { path: '/notifications', route: NotificationRoutes },

  { path: '/public', route: PublicRoutes },

  { path: '/job', route: JobRoutes },
  { path: '/application', route: ApplicationRoutes }
]

apiRoutes.forEach(route => {
  router.use(route.path, route.route)
})

export default router
