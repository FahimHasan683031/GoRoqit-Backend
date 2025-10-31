"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/cornJobs/subscriptionExpirationCron.ts
const node_cron_1 = __importDefault(require("node-cron"));
const utils_1 = require("../app/modules/subscription/utils");
const subscriptionCron = node_cron_1.default.schedule('0 0 * * *', async () => {
    console.log('⏰ Running subscription expiration check...');
    console.log('Running at:', new Date().toISOString());
    await (0, utils_1.checkAndUpdateExpiredSubscriptions)();
});
// Start the job
subscriptionCron.start();
exports.default = subscriptionCron;
