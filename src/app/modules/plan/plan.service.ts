import { StatusCodes } from 'http-status-codes'
import { IPlan } from './plan.interface'
import { Plan } from './plan.model'
import mongoose from 'mongoose'
import stripe from '../../../config/stripe'
import { createStripeProductCatalog } from '../../../stripe/createStripeProductCatalog'
import ApiError from '../../../errors/ApiError'
import { deleteStripeProductCatalog } from '../../../stripe/deleteStripeProductCatalog'
import { Subscription } from '../subscription/subscription.model'
// Create plan in DB and Stripe Product
const createPlanToDB = async (payload: IPlan): Promise<IPlan | null> => {
  const productPayload = {
    title: payload.title,
    description: payload.description,
    duration: payload.duration,
    price: Number(payload.price),
  }

  const product = await createStripeProductCatalog(productPayload)

  if (!product) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Failed to create subscription product',
    )
  }

  if (product) {
    payload.paymentLink = product.paymentLink
    payload.productId = product.productId
    payload.priceId = product.priceId
  }

  const result = await Plan.create(payload)
  if (!result) {
    await stripe.products.del(product.productId)
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to created Package')
  }

  return result
}
// Update plan in DB and Stripe Product
const updatePlanToDB = async (
  id: string,
  payload: Partial<IPlan>,
): Promise<IPlan | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid ID')
  }

  // 1. Find existing plan
  const existingPlan = await Plan.findById(id)
  if (!existingPlan) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Plan not found')
  }

  // Access properties directly as they are now primitive types
  const productId = existingPlan.productId || undefined
  const currentTitle = existingPlan.title || undefined
  const currentDescription = existingPlan.description || undefined

  // 2. Update Product on Stripe (if title/description changed)
  if (payload.title || payload.description) {
    if (!productId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Missing Stripe Product ID')
    }

    await stripe.products.update(productId, {
      name: payload.title ?? currentTitle,
      description: payload.description ?? currentDescription,
    })
  }

  // 3. If price changes → create new Stripe Price
  if (payload.price && payload.price !== existingPlan.price) {
    if (!productId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Missing Stripe Product ID')
    }

    const price = await stripe.prices.create({
      unit_amount: Number(payload.price) * 100, // ensure number
      currency: 'gbp', // ✅ UK Pound
      recurring: {
        interval:
          payload.paymentType?.toLowerCase() === 'yearly' ? 'year' : 'month',
      },
      product: productId,
    })

    payload.priceId = price.id

    // Optional: generate a new Payment Link
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [{ price: price.id, quantity: 1 }],
    })

    payload.paymentLink = paymentLink.url
  }

  // 4. Update MongoDB
  const result = await Plan.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true },
  )

  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to update plan in DB')
  }

  return result
}
// Get plan from DB
const getPlanFromDB = async (paymentType: string) => {
  const query: any = {
    status: 'Active',
  }
  if (paymentType) {
    query.paymentType = paymentType
  }
  const result = await Plan.find(query)
  const activeSubscriptions = await Subscription.countDocuments({
    status: 'active',
  })
  const expiredSubscriptions = await Subscription.countDocuments({
    status: 'expired',
  })
  const failedSubscriptions = await Subscription.countDocuments({
    status: 'cancel',
  })
  const meta = {
    activeSubscriptions,
    expiredSubscriptions,
    failedSubscriptions,
  }

  return {
    plans: result,
    meta,
  }
}
// Get plan details from DB
const getPlanDetailsFromDB = async (id: string): Promise<IPlan | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid ID')
  }
  const result = await Plan.findById(id)
  return result
}

// Delete plan from DB and Stripe
const deletePlanToDB = async (id: string): Promise<IPlan | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid ID')
  }

  const isExist = await Plan.findById(id)
  if (!isExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Plan not found')
  }

  if (isExist.productId) {
    await deleteStripeProductCatalog(isExist.productId)
  }

  const result = await Plan.findByIdAndUpdate(
    { _id: id },
    { status: 'Delete' },
    { new: true },
  )

  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to deleted Package')
  }

  return result
}

export const PackageService = {
  createPlanToDB,
  updatePlanToDB,
  getPlanFromDB,
  getPlanDetailsFromDB,
  deletePlanToDB,
}
