import { Schema, model } from 'mongoose';
import { IApplication, ApplicationModel } from './application.interface'; 

const ApplicationSchema = new Schema<IApplication, ApplicationModel>({
  job: { type: Schema.Types.ObjectId, ref: 'Job' },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  name: { type: String ,required: true }, 
  title: { type: String ,required: true }, 
  location: { type: String ,required: true },
  email: { type: String ,required: true },
  phone: { type: String ,required: true },
  resume: { type: String ,required: true },
  experience: { type: Number }
}, {
  timestamps: true
});

export const Application = model<IApplication, ApplicationModel>('Application', ApplicationSchema);
