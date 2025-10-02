"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_route_1 = require("../app/modules/user/user.route");
const auth_route_1 = require("../app/modules/auth/auth.route");
const express_1 = __importDefault(require("express"));
const notifications_route_1 = require("../app/modules/notifications/notifications.route");
const public_route_1 = require("../app/modules/public/public.route");
const job_route_1 = require("../app/modules/job/job.route");
const application_route_1 = require("../app/modules/application/application.route");
const plan_routes_1 = require("../app/modules/plan/plan.routes");
const subscription_routes_1 = require("../app/modules/subscription/subscription.routes");
const profile_route_1 = require("../app/modules/profile/profile.route");
const chat_routes_1 = require("../app/modules/chat/chat.routes");
const message_routes_1 = require("../app/modules/message/message.routes");
const category_route_1 = require("../app/modules/category/category.route");
const dashboard_rout_1 = require("../app/modules/dashboard/dashboard.rout");
const router = express_1.default.Router();
const apiRoutes = [
    { path: '/user', route: user_route_1.UserRoutes },
    { path: '/auth', route: auth_route_1.AuthRoutes },
    { path: '/notifications', route: notifications_route_1.NotificationRoutes },
    { path: '/public', route: public_route_1.PublicRoutes },
    { path: '/job', route: job_route_1.JobRoutes },
    { path: '/application', route: application_route_1.ApplicationRoutes },
    { path: '/plan', route: plan_routes_1.PlanRoutes },
    { path: '/subscription', route: subscription_routes_1.SubscriptionRoutes },
    { path: '/profile', route: profile_route_1.ProfileRoutes },
    { path: '/chat', route: chat_routes_1.ChatRoutes },
    { path: '/message', route: message_routes_1.MessageRoutes },
    { path: '/category', route: category_route_1.categoryRoutes },
    { path: '/dashboard', route: dashboard_rout_1.DashboardRoutes },
];
apiRoutes.forEach(route => {
    router.use(route.path, route.route);
});
exports.default = router;
