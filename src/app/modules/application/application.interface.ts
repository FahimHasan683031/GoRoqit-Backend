import { Model, Types } from 'mongoose'

export interface IApplication {
  _id: Types.ObjectId
  job: Types.ObjectId
  applicant: Types.ObjectId
  author: Types.ObjectId
  name: string
  title: string
  location: string
  email: string
  phone: string
  resume: string
}

export type ApplicationModel = Model<IApplication, {}, {}>
