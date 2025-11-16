import { Schema, model } from 'mongoose';
import { IApplication, ApplicationModel } from './application.interface'; 

const ApplicationSchema = new Schema<IApplication, ApplicationModel>({
  job: { type: Schema.Types.ObjectId, ref: 'Job' ,required: true },
  applicant: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User',  required:true},
  name: { type: String ,required: true }, 
  title: { type: String ,required: true }, 
  location: { type: String ,required: true },
  email: { type: String ,required: true },
  phone: { type: String ,required: true },
  resume: { type: String ,required: true },
}, {
  timestamps: true
});

export const Application = model<IApplication, ApplicationModel>('Application', ApplicationSchema);
