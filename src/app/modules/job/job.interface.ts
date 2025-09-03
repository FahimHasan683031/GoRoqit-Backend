import { Types } from 'mongoose'

export interface IJob {
  title: string
  category?: string
  type: 'Full-time' | 'Remote' | 'Freelance'
  startDate: Date
  endDate?: Date
  minSalary: number
  maxSalary: number
  description?: string
  responsibilities?: string
  jobLocation: string
  user: Types.ObjectId
  applicationsCount?: number
}
