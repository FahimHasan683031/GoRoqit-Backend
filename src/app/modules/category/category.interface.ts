import { Types } from 'mongoose';

export type ICategory = {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}