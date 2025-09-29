import { User } from '../user/user.model'
import { Job } from '../job/job.model'
import { Subscription } from '../subscription/subscription.model'
import { Application } from '../application/application.model'
import { USER_ROLES } from '../user/user.interface'
import { calculateMonthlyRevenue } from './revenue.utils'


export const getDashboardStatistics = async (year?: string) => {
  // Default to current year if not provided
  let targetYear = new Date().getFullYear()
  if (year) {
    targetYear = Number(year)
  }

  // Users
  const totalUsers = await User.countDocuments()
  const totalRecruiters = await User.countDocuments({
    role: USER_ROLES.RECRUITER,
  })
  const totalApplicants = await User.countDocuments({
    role: USER_ROLES.APPLICANT,
  })

  // Jobs
  const totalJobs = await Job.countDocuments()

  // Applications
  const totalApplications = await Application.countDocuments()

  // Subscriptions
  const totalSubscriptions = await Subscription.countDocuments()
  const activeSubscriptions = await Subscription.countDocuments({
    status: 'active',
  })
  const expiredSubscriptions = await Subscription.countDocuments({
    status: 'expired',
  })
  const failedSubscriptions = await Subscription.countDocuments({
    status: 'cancel',
  })

  // Total revenue (active only)
  const totalRevenueAgg = await Subscription.aggregate([
    { $match: { status: 'active' } },
    { $group: { _id: null, totalRevenue: { $sum: '$price' } } },
  ])
  const totalRevenue =
    totalRevenueAgg.length > 0 ? totalRevenueAgg[0].totalRevenue : 0

  const monthlyRevenue = await calculateMonthlyRevenue(targetYear)


  return {
    users: {
      totalUsers,
      totalRecruiters,
      totalApplicants,
    },
    jobs: {
      totalJobs,
    },
    applications: {
      totalApplications,
    },
    subscriptions: {
      totalSubscriptions,
      activeSubscriptions,
      expiredSubscriptions,
      failedSubscriptions,
      totalRevenue,
    },
    monthlyRevenue,
  }
}
export const DashboardServices = {
  getDashboardStatistics,
}
