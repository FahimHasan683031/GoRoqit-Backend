import { Types } from 'mongoose'

export interface IJob {
  title: string
  category?: string
  type: "Full-time" | "Part-time" | "Temp" | "Self-employed" | "Chair-rental";
  startDate: Date
  endDate?: Date
  minSalary: number
  maxSalary: number
  description?: string
  responsibilities?: string
  jobLocation: string
  user: Types.ObjectId
  experianceLabel: 'Experienced' | 'Beginner' | 'Freshers'
  applicationsCount?: number
}
