import { Schema, model } from 'mongoose';
import { IApplicant, ApplicantModel } from './applicant.interface'; 

const applicantSchema = new Schema<IApplicant, ApplicantModel>({
  job: { type: Schema.Types.ObjectId, ref: 'Job' },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  name: { type: String ,required: true }, 
  title: { type: String ,required: true }, 
  location: { type: String ,required: true },
  email: { type: String ,required: true },
  phone: { type: String ,required: true },
  resume: { type: String ,required: true },
  experience: { type: Number },
  appliedAt: { type: Date }, 
}, {
  timestamps: true
});

export const Applicant = model<IApplicant, ApplicantModel>('Applicant', applicantSchema);
