import { Types } from 'mongoose';

export type ICategory = {
  _id: Types.ObjectId;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}