import { Subscription } from "../subscription/subscription.model";

export const calculateMonthlyRevenue = async (targetYear: number) => {
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
            $group: {
                _id: { month: { $month: "$currentPeriodStart" } },
                revenue: { $sum: "$price" },
                count: { $sum: 1 }
            }
        },
        { $sort: { "_id.month": 1 } }
    ]);

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

    const monthlyRevenueMap = new Map();
    monthlyRevenueAgg.forEach(item => {
        monthlyRevenueMap.set(item._id.month, item);
    });

    return allMonths.map(monthInfo => {
        const existingData = monthlyRevenueMap.get(monthInfo.month);
        return {
            month: monthInfo.month,
            monthName: monthInfo.monthName,
            revenue: existingData ? existingData.revenue : 0,
            count: existingData ? existingData.count : 0,
            year: targetYear
        };
    });
};
