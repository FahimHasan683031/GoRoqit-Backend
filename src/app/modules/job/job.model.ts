import { Schema, model } from 'mongoose';
import { IJob, JobModel } from './job.interface'; 

const jobSchema = new Schema<IJob, JobModel>({
  title: { type: String }, required: true,
  category: { type: String },
  type: { type: String },
  startDate: { type: Date }, required: true,
  endDate: { type: Date },
  userEmail: { type: String }, required: true,
  description: { type: String },
  responsibilities: { type: String },
}, {
  timestamps: true
});

export const Job = model<IJob, JobModel>('Job', jobSchema);
