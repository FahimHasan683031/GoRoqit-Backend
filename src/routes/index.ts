import { UserRoutes } from '../app/modules/user/user.route'
import { AuthRoutes } from '../app/modules/auth/auth.route'
import express, { Router } from 'express'
import { NotificationRoutes } from '../app/modules/notifications/notifications.route'
import { PublicRoutes } from '../app/modules/public/public.route'
import { JobRoutes } from '../app/modules/job/job.route'
import { ApplicationRoutes } from '../app/modules/application/application.route'
import { PlanRoutes } from '../app/modules/plan/plan.routes'
import { SubscriptionRoutes } from '../app/modules/subscription/subscription.routes'
import { ProfileRoutes } from '../app/modules/profile/profile.route'
import { ChatRoutes } from '../app/modules/chat/chat.routes'
import { MessageRoutes } from '../app/modules/message/message.routes'
import { categoryRoutes } from '../app/modules/category/category.route'
import { DashboardRoutes } from '../app/modules/dashboard/dashboard.rout'

const router = express.Router()

const apiRoutes: { path: string; route: Router }[] = [
  { path: '/user', route: UserRoutes },
  { path: '/auth', route: AuthRoutes },
  { path: '/notifications', route: NotificationRoutes },
  { path: '/public', route: PublicRoutes },
  { path: '/job', route: JobRoutes },
  { path: '/application', route: ApplicationRoutes },
  { path: '/plan', route: PlanRoutes },
  { path: '/subscription', route: SubscriptionRoutes },
  { path: '/profile', route: ProfileRoutes },
  { path: '/chat', route: ChatRoutes },
  { path: '/message', route: MessageRoutes },
  { path: '/category', route: categoryRoutes },
  { path: '/dashboard', route: DashboardRoutes },
]

apiRoutes.forEach(route => {
  router.use(route.path, route.route)
})

export default router
