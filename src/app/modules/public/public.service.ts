import { StatusCodes } from 'http-status-codes'
import ApiError from '../../../errors/ApiError'
import { IContact, IFaq, IPublic } from './public.interface'
import { Contact, Faq, Public } from './public.model'

import { User } from '../user/user.model'
import { emailHelper } from '../../../helpers/emailHelper'
import QueryBuilder from '../../builder/QueryBuilder'
import { emailTemplate } from '../../../shared/emailTemplate'

const createPublic = async (payload: IPublic) => {
  const isExist = await Public.findOne({
    type: payload.type,
  })
  if (isExist) {
    await Public.findByIdAndUpdate(
      isExist._id,
      {
        $set: {
          content: payload.content,
        },
      },
      {
        new: true,
      },
    )
    //store the result in redis
    // redisClient.del(payload.type === 'privacy-policy' ? `public:${RedisKeys.PRIVACY_POLICY}` : `public:${RedisKeys.TERMS_AND_CONDITION}`)
    // redisClient.setex(payload.type === 'privacy-policy' ? `public:${RedisKeys.PRIVACY_POLICY}` : `public:${RedisKeys.TERMS_AND_CONDITION}`, 60 * 60 * 24, JSON.stringify(isExist))
  } else {
    const result = await Public.create(payload)
    if (!result)
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create Public')
    //store the result in redis
    // redisClient.del(payload.type === 'privacy-policy' ? `public:${RedisKeys.PRIVACY_POLICY}` : `public:${RedisKeys.TERMS_AND_CONDITION}`)
    // redisClient.setex(payload.type === 'privacy-policy' ? `public:${RedisKeys.PRIVACY_POLICY}` : `public:${RedisKeys.TERMS_AND_CONDITION}`, 60 * 60 * 24, JSON.stringify(result))
  }

  return `${payload.type} created successfully}`
}

const getAllPublics = async (
  type: 'privacy-policy' | 'terms-and-condition',
) => {
  // const cachedResult = await redisClient.get(type === 'privacy-policy' ? `public:${RedisKeys.PRIVACY_POLICY}` : `public:${RedisKeys.TERMS_AND_CONDITION}`)
  // if (cachedResult) {
  //   return JSON.parse(cachedResult)
  // }
  const result = await Public.findOne({ type: type }).lean()
  //store the result in redis
  // redisClient.setex(type === 'privacy-policy' ? `public:${RedisKeys.PRIVACY_POLICY}` : `public:${RedisKeys.TERMS_AND_CONDITION}`, 60 * 60 * 24, JSON.stringify(result))
  return result || null
}

const deletePublic = async (id: string) => {
  const result = await Public.findByIdAndDelete(id)
  return result
}

const createContact = async (payload: IContact) => {
  try {
    // Find admin user to send notification
    const admin = await User.findOne({ role: 'admin' })

    if (!admin || !admin.email) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Admin user not found',
      )
    }

    const result = await Contact.create(payload)
    if (!result)
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create Contact')
    // send admin email
    await emailHelper.sendEmail(
      emailTemplate.adminContactNotificationEmail(payload),
    )
    // send user email
    await emailHelper.sendEmail(
      emailTemplate.userContactConfirmationEmail(payload),
    )

    return {
      message: 'Contact form submitted successfully',
    }
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to submit contact form',
    )
  }
}

const getAllContacts = async (query: Record<string, unknown>) => {
  const contactQueryBuilder = new QueryBuilder(Contact.find(), query)

  contactQueryBuilder.paginate()

  const result = await contactQueryBuilder.modelQuery.lean()

  // Get pagination info separately
  const paginationResult = await contactQueryBuilder.getPaginationInfo()

  // Return clean objects without circular references
  return {
    meta: paginationResult,
    result,
  }
}

const createFaq = async (payload: IFaq) => {
  const result = await Faq.create(payload)
  if (!result)
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create Faq')
  // redisClient.del(`public:${RedisKeys.FAQ}`)
  return result
}

const getAllFaqs = async () => {
  // const cachedResult = await redisClient.get(`public:${RedisKeys.FAQ}`)
  // if (cachedResult) {
  // return JSON.parse(cachedResult)
  // }
  const result = await Faq.find({})
  // redisClient.setex(`public:${RedisKeys.FAQ}`, 60 * 60 * 24, JSON.stringify(result))
  return result || []
}

const getSingleFaq = async (id: string) => {
  const result = await Faq.findById(id)
  return result || null
}

const updateFaq = async (id: string, payload: Partial<IFaq>) => {
  const result = await Faq.findByIdAndUpdate(
    id,
    { $set: payload },
    {
      new: true,
    },
  )
  // redisClient.del(`public:${RedisKeys.FAQ}`)
  return result
}

const deleteFaq = async (id: string) => {
  const result = await Faq.findByIdAndDelete(id)
  // redisClient.del(`public:${RedisKeys.FAQ}`)
  return result
}

export const PublicServices = {
  createPublic,
  getAllPublics,
  deletePublic,
  createContact,
  createFaq,
  getAllFaqs,
  getSingleFaq,
  updateFaq,
  deleteFaq,
  getAllContacts,
}
