import { Schema, model, Types } from 'mongoose';
import { IJob} from './job.interface';

const jobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true },
    category: { type: String },
    type: { type: String, enum: ['Full-time', 'Remote', 'Freelance'], required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    minSalary: { type: Number, required: true },
    maxSalary: { type: Number, required: true },
    description: { type: String, maxlength: 500 },
    responsibilities: { type: String, maxlength: 500 },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    jobLocation: { type: String, required: true },
    applicationsCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const Job = model<IJob>('Job', jobSchema);
