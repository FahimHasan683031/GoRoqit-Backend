import { Types } from 'mongoose'

export interface IJob {
  title: string
  category?: string
  type: "Full-time" | "Part-time" | "Temp" 
  engagementType: "Self-employed" | "Chair-rental" | "Salaried"
  startDate: Date
  salryType?: "yearly" | "monthly" | "weekly" | "hourly";
  minSalary: number
  maxSalary: number
  description?: string
  jobLocation: string
  user: Types.ObjectId
  experianceLabel: 'Junior' | 'Mid-Level' | 'Senior'|"Master"
  applicationsCount?: number
}
