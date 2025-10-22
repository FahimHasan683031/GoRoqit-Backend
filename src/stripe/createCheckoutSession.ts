import { Request, Response } from "express";
import stripe from "../config/stripe";
import { User } from "../app/modules/user/user.model";
import { Plan } from "../app/modules/plan/plan.model";
import ApiError from "../errors/ApiError";
import { StatusCodes } from "http-status-codes";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";


export const createCheckoutSession = async (req: Request, res: Response) => {
  const { authId: userId } = req.user as JwtPayload;
  const { planId } = req.body;

  const user = await User.findById(userId);
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, "User not found");

  const plan = await Plan.findById(planId);
  if (!plan) throw new ApiError(StatusCodes.NOT_FOUND, "Plan not found");

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: plan.priceId,
        quantity: 1,
      },
    ],
    customer_email: user.email,
    success_url: `${config.stripe.frontendUrl}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.stripe.frontendUrl}/payments/cancel`,
    metadata: {
      planId: plan._id.toString(),
      userId: user._id.toString(),
    },
  });

  // res.status(StatusCodes.OK).json({ url: session.url });
  res.redirect(session.url as string)
};
