"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const config_1 = __importDefault(require("../config"));
const stripe_1 = __importDefault(require("../config/stripe"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const handleSubscriptionCreated_1 = require("./handleSubscriptionCreated");
const logger_1 = require("../shared/logger");
const handleStripeWebhook = async (req, res) => {
    console.log("hit stripe webhook");
    const signature = req.headers["stripe-signature"];
    const webhookSecret = config_1.default.stripe.webhookSecret;
    let event;
    try {
        event = stripe_1.default.webhooks.constructEvent(req.body, signature, webhookSecret);
    }
    catch (error) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, `Webhook verification failed: ${error}`);
    }
    const data = event.data.object;
    const eventType = event.type;
    try {
        switch (eventType) {
            case "checkout.session.completed":
                logger_1.logger.info("✅ Checkout completed:", data.id);
                break;
            case "customer.subscription.created":
                await (0, handleSubscriptionCreated_1.handleSubscriptionCreated)(data);
                break;
            default:
                logger_1.logger.info(`⚠️ Unhandled event type: ${eventType}`);
        }
    }
    catch (error) {
        logger_1.logger.error("Webhook error:", error);
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, `${error}`);
    }
    res.sendStatus(200);
};
exports.default = handleStripeWebhook;
