import { StatusCodes } from 'http-status-codes'
import Stripe from 'stripe'
import { User } from '../app/modules/user/user.model'
import { Subscription } from '../app/modules/subscription/subscription.model'
import { Plan } from '../app/modules/plan/plan.model'
import stripe from '../config/stripe'
import ApiError from '../errors/ApiError'

// Helper function to create new subscription in database
const createNewSubscription = async (payload: any) => {
  const isExistSubscription = await Subscription.findOne({
    user: payload.user,
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
    // Retrieve subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(
      data.id as string,
      {
        expand: ['latest_invoice.payment_intent'],
      },
    )
    const customer = (await stripe.customers.retrieve(
      subscription.customer as string,
    )) as Stripe.Customer

    const productId = subscription.items.data[0]?.price?.product as string

    const invoice = subscription.latest_invoice as Stripe.Invoice

    const invoicePdf = invoice.invoice_pdf // Direct link to PDF


    const trxId = (invoice as any)?.payment_intent as string

    const amountPaid = (invoice?.total || 0) / 100

    // Find user and pricing plan
    const user = (await User.findOne({ email: customer.email })) as any

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Invalid User!')
    }

    const plan = (await Plan.findOne({ productId })) as any

    if (!plan) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Invalid Plan!')
    }
    const currentPeriodStart = subscription.start_date
      ? new Date(subscription.start_date * 1000)
      : null

    // calcualte currentPeriodEnd
    let currentPeriodEnd = null

    if (subscription.start_date && plan.duration) {
      const start = new Date(subscription.start_date * 1000)

      const [durationValue, durationUnit] = plan.duration.split(' ')

      const count = parseInt(durationValue)

      switch (durationUnit) {
        case 'month':
        case 'months':
          start.setMonth(start.getMonth() + count)
          break

        case 'year':
        case 'years':
          start.setFullYear(start.getFullYear() + count)
          break

        default:
          console.warn('Unknown plan duration:', plan.duration)
          break
      }

      currentPeriodEnd = start
    }

    const payload = {
      customerId: customer.id,
      price: amountPaid,
      user: user._id,
      plan: plan._id,
      trxId,
      subscriptionId: subscription.id,
      status: 'active',
      invoice:invoicePdf,
      currentPeriodStart,
      currentPeriodEnd,
    }

    await createNewSubscription(payload)

    await User.findByIdAndUpdate(
      { _id: user._id },
      { subscribe: true },
      { new: true },
    )
  } catch (error) {
    console.error('Error in handleSubscriptionCreated:', error)
    return error
  }
}
