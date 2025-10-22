import { Request, Response } from "express";
import Stripe from "stripe";
import { StatusCodes } from "http-status-codes";
import config from "../config";
import stripe from "../config/stripe";
import ApiError from "../errors/ApiError";
import { handleSubscriptionCreated } from "./handleSubscriptionCreated";
import { logger } from "../shared/logger";

const handleStripeWebhook = async (req: Request, res: Response) => {
  console.log("hit stripe webhook");
  const signature = req.headers["stripe-signature"] as string;
  const webhookSecret = config.stripe.webhookSecret as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, `Webhook verification failed: ${error}`);
  }

  const data = event.data.object as any;
  const eventType = event.type;

  try {
    switch (eventType) {
      case "checkout.session.completed":
        logger.info("✅ Checkout completed:", data.id);
        break;

      case "customer.subscription.created":
        await handleSubscriptionCreated(data as Stripe.Subscription);
        break;

      default:
        logger.info(`⚠️ Unhandled event type: ${eventType}`);
    }
  } catch (error) {
    logger.error("Webhook error:", error);
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `${error}`);
  }

  res.sendStatus(200);
};

export default handleStripeWebhook;
