import { StatusCodes } from 'http-status-codes'
import Stripe from 'stripe'
import stripe from '../config/stripe'
import { User } from '../app/modules/user/user.model'
import { Subscription } from '../app/modules/subscription/subscription.model'
import { Plan } from '../app/modules/plan/plan.model'
import ApiError from '../errors/ApiError'

// Helper function to create new subscription in database
const createNewSubscription = async (payload: any) => {
  const isExistSubscription = await Subscription.findOne({
    user: payload.vendor,
  })
  if (isExistSubscription) {
    await Subscription.findByIdAndUpdate(
      { _id: isExistSubscription._id },
      payload,
      { new: true },
    )
  } else {
    const newSubscription = new Subscription(payload)
    await newSubscription.save()
  }
}

export const handleSubscriptionCreated = async (data: Stripe.Subscription) => {
  try {
    console.log('hit')
    console.log(data)
    // Retrieve subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve("sub_1S5YCTGhgUPSwjlAesQuyCxo")
    console.log({subscriptionInfo:subscription})
    const customer = (await stripe.customers.retrieve(
      subscription.customer as string,
    )) as Stripe.Customer
    console.log({customerInfo:customer})
    const productId = subscription.items.data[0]?.price?.product as string
    const invoice = (await stripe.invoices.retrieve(
      subscription.latest_invoice as string,
    )) as Stripe.Invoice
    console.log({invoiceInfo:invoice})

    const trxId = (invoice as any)?.payment_intent as string
    const amountPaid = (invoice?.total || 0) / 100

    // Find user and pricing plan
    const user = (await User.findOne({ email: customer.email })) as any
    console.log(user)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Invalid User!')
    }

    const plan = (await Plan.findOne({ productId })) as any
    if (!plan) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Invalid Plan!')
    }

    // Get the current period start and end dates (Unix timestamps)
    const currentPeriodStart = new Date(
      (subscription as any)?.current_period_start * 1000,
    ).toISOString() // Convert to human-readable date
    const currentPeriodEnd = new Date(
      (subscription as any)?.current_period_end * 1000,
    ).toISOString()

    const payload = {
      customerId: customer.id,
      price: amountPaid,
      vendor: user._id,
      plan: plan._id,
      trxId,
      subscriptionId: subscription.id,
      status: 'active',
      currentPeriodStart,
      currentPeriodEnd,
    }
    // Create new subscription and update user status
    await createNewSubscription(payload)

    await User.findByIdAndUpdate(
      { _id: user._id },
      { subscribe: true },
      { new: true },
    )
  } catch (error) {
    return error
  }
}
