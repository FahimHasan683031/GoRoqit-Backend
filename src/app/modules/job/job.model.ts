import { Schema, model, Types } from 'mongoose';
import { IJob} from './job.interface';

const jobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true },
    category: { type: String },
    type: { type: String, enum: ['Full-time', 'Part-time', 'Temp'], required: true },
    engagementType: { type: String, enum: ['Self-employed', 'Chair-rental', 'Salaried'], required: true },
    startDate: { type: Date, required: true },
    paymentType: { type: String, enum: ['yearly', 'monthly', 'weekly', 'hourly'] },
    minSalary: { type: Number },
    maxSalary: { type: Number },
    rent: { type: Number },
    description: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    jobLocation: { type: String, required: true },
    applicationsCount: { type: Number, default: 0 },
    experianceLabel: { type: String, enum: ['Junior', 'Mid-Level', 'Senior', 'Master'], required: true },
  },
  {
    timestamps: true,
  }
);

export const Job = model<IJob>('Job', jobSchema);
