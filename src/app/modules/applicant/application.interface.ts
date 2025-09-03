import { Model, Types } from 'mongoose'

export interface IApplication {
  _id: Types.ObjectId
  job: Types.ObjectId
  user: Types.ObjectId
  name: string
  title: string
  location: string
  email: string
  phone: string
  resume: string
  experience: number
}

export type ApplicationModel = Model<IApplication, {}, {}>
