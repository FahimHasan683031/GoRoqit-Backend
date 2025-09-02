import { Model, Types } from 'mongoose';

export interface IApplicant {
  _id: Types.ObjectId;
  job: Types.ObjectId;
  user: Types.ObjectId;
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  resume: string;
  experience: number;
  appliedAt: Date;
}

export type ApplicantModel = Model<IApplicant, {}, {}>;
