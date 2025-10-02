"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardServices = exports.getDashboardStatistics = void 0;
const user_model_1 = require("../user/user.model");
const job_model_1 = require("../job/job.model");
const subscription_model_1 = require("../subscription/subscription.model");
const application_model_1 = require("../application/application.model");
const user_interface_1 = require("../user/user.interface");
const revenue_utils_1 = require("./revenue.utils");
const message_model_1 = require("../message/message.model");
const getDashboardStatistics = async (year) => {
    // Default to current year if not provided
    let targetYear = new Date().getFullYear();
    if (year) {
        targetYear = Number(year);
    }
    // Users
    const totalUsers = await user_model_1.User.countDocuments();
    const totalRecruiters = await user_model_1.User.countDocuments({
        role: user_interface_1.USER_ROLES.RECRUITER,
    });
    const totalApplicants = await user_model_1.User.countDocuments({
        role: user_interface_1.USER_ROLES.APPLICANT,
    });
    // Jobs
    const totalJobs = await job_model_1.Job.countDocuments();
    // Applications
    const totalApplications = await application_model_1.Application.countDocuments();
    // Subscriptions
    const totalSubscriptions = await subscription_model_1.Subscription.countDocuments();
    const activeSubscriptions = await subscription_model_1.Subscription.countDocuments({
        status: 'active',
    });
    const expiredSubscriptions = await subscription_model_1.Subscription.countDocuments({
        status: 'expired',
    });
    const failedSubscriptions = await subscription_model_1.Subscription.countDocuments({
        status: 'cancel',
    });
    // Total revenue (active only)
    const totalRevenueAgg = await subscription_model_1.Subscription.aggregate([
        { $match: { status: 'active' } },
        { $group: { _id: null, totalRevenue: { $sum: '$price' } } },
    ]);
    const totalRevenue = totalRevenueAgg.length > 0 ? totalRevenueAgg[0].totalRevenue : 0;
    const monthlyRevenue = await (0, revenue_utils_1.calculateMonthlyRevenue)(targetYear);
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
    };
};
exports.getDashboardStatistics = getDashboardStatistics;
const rectuterStatistics = async (user, year) => {
    const totalJobs = await job_model_1.Job.countDocuments({ user: user.authId });
    const totalApplications = await application_model_1.Application.countDocuments({
        author: user.authId,
    });
    const totalChats = await message_model_1.Message.countDocuments({
        participants: { $in: [user.authId] },
    });
    return {
        totalJobs,
        totalApplications,
        totalChats,
    };
};
exports.DashboardServices = {
    getDashboardStatistics: exports.getDashboardStatistics,
    rectuterStatistics
};
