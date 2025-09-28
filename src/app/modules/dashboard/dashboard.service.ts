import { User } from '../user/user.model';
import { Job } from '../job/job.model';
import { Subscription } from '../subscription/subscription.model';
import { Application } from '../application/application.model';
import { USER_ROLES } from '../user/user.interface';


export const getDashboardStatistics = async (year?: string) => {
    // Default to current year if not provided
    let targetYear = new Date().getFullYear();
    if (year) {
        targetYear = Number(year);
    }

    console.log(`Fetching dashboard statistics for year: ${targetYear}`);

    // Users
    const totalUsers = await User.countDocuments();
    const totalRecruiters = await User.countDocuments({ role: USER_ROLES.RECRUITER });
    const totalApplicants = await User.countDocuments({ role: USER_ROLES.APPLICANT });

    // Jobs
    const totalJobs = await Job.countDocuments();

    // Applications
    const totalApplications = await Application.countDocuments();

    // Subscriptions
    const totalSubscriptions = await Subscription.countDocuments();
    const activeSubscriptions = await Subscription.countDocuments({ status: 'active' });
    const expiredSubscriptions = await Subscription.countDocuments({ status: 'expired' });
    const failedSubscriptions = await Subscription.countDocuments({ status: 'cancel' });

    // Total revenue (active only)
    const totalRevenueAgg = await Subscription.aggregate([
        { $match: { status: 'active' } },
        { $group: { _id: null, totalRevenue: { $sum: '$price' } } },
    ]);
    const totalRevenue = totalRevenueAgg.length > 0 ? totalRevenueAgg[0].totalRevenue : 0;

    // Monthly revenue calculation - FIXED: Using currentPeriodStart instead of createdAt
    const monthlyRevenueAgg = await Subscription.aggregate([
        {
            $match: {
                status: 'active',
                currentPeriodStart: {
                    $gte: new Date(`${targetYear}-01-01T00:00:00.000Z`),
                    $lt: new Date(`${targetYear + 1}-01-01T00:00:00.000Z`),
                }
            }
        },
        {
            $addFields: {
                // Convert string date to Date object
                periodStartDate: { $toDate: "$currentPeriodStart" }
            }
        },
        {
            $group: {
                _id: {
                    month: { $month: "$periodStartDate" }
                },
                revenue: { $sum: "$price" },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { "_id.month": 1 }
        }
    ]);

    console.log('Monthly revenue aggregation result:', monthlyRevenueAgg);

    // Create complete monthly data with all months
    const allMonths = [
        { month: 1, monthName: 'Jan' },
        { month: 2, monthName: 'Feb' },
        { month: 3, monthName: 'Mar' },
        { month: 4, monthName: 'Apr' },
        { month: 5, monthName: 'May' },
        { month: 6, monthName: 'Jun' },
        { month: 7, monthName: 'Jul' },
        { month: 8, monthName: 'Aug' },
        { month: 9, monthName: 'Sep' },
        { month: 10, monthName: 'Oct' },
        { month: 11, monthName: 'Nov' },
        { month: 12, monthName: 'Dec' }
    ];

    // Create a map of existing monthly data
    const monthlyRevenueMap = new Map();
    monthlyRevenueAgg.forEach(item => {
        monthlyRevenueMap.set(item._id.month, item);
    });

    // Build complete monthly revenue array
    const completeMonthlyRevenue = allMonths.map(monthInfo => {
        const existingData = monthlyRevenueMap.get(monthInfo.month);
        
        if (existingData) {
            return {
                month: monthInfo.month,
                monthName: monthInfo.monthName,
                revenue: existingData.revenue,
                count: existingData.count,
                year: targetYear
            };
        } else {
            return {
                month: monthInfo.month,
                monthName: monthInfo.monthName,
                revenue: 0,
                count: 0,
                year: targetYear
            };
        }
    });

    // Debug information
    console.log('Total active subscriptions:', activeSubscriptions);
    console.log('Total revenue:', totalRevenue);
    console.log('Complete monthly revenue:', completeMonthlyRevenue);

    return {
        users: { 
            totalUsers, 
            totalRecruiters, 
            totalApplicants 
        },
        jobs: { 
            totalJobs 
        },
        applications: { 
            totalApplications 
        },
        subscriptions: {
            totalSubscriptions,
            activeSubscriptions,
            expiredSubscriptions,
            failedSubscriptions,
            totalRevenue,
        },
        monthlyRevenue: completeMonthlyRevenue,
    };
};
export const DashboardServices = {
  getDashboardStatistics,
}
