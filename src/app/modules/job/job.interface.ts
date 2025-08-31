import { Model, Types } from 'mongoose';

export interface IJobFilterables {
  searchTerm?: string;
  title?: string;
  category?: string;
  userEmail?: string;
  description?: string;
  responsibilities?: string;
}

export interface IJob {
  _id: Types.ObjectId;
  title: string;
  category: string;
  type: string;
  startDate: Date;
  endDate?: Date;
  userEmail: string;
  description: string;
  responsibilities: string;
}

export type JobModel = Model<IJob, {}, {}>;
