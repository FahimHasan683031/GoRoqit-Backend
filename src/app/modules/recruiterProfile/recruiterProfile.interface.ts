import { Types } from 'mongoose'

export type IRecruiterProfile = {
  _id: Types.ObjectId
  userId: Types.ObjectId
  companyName: string
  companyWebsite?: string
  companyDescription?: string
  companyLogo?: string
  phone?: string
  bio?: string
  createdAt: Date
  updatedAt: Date
}
