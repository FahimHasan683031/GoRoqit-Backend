"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const utils_1 = require("../app/modules/subscription/utils");
// Run daily at 2:00 AM (off-peak hours)
const subscriptionCron = node_cron_1.default.schedule('0 2 * * *', async () => {
    console.log('Running subscription expiration check...');
    await (0, utils_1.checkAndUpdateExpiredSubscriptions)();
});
exports.default = subscriptionCron;
