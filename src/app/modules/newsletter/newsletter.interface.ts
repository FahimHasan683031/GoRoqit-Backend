import { Types } from 'mongoose'

export type INewsletter = {
  _id?: Types.ObjectId
  email: string
}
