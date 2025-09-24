import { model, Schema } from "mongoose";
import { ICategory } from "./category.interface";

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
  },
  { timestamps: true }
);

export const Category = model<ICategory>('Category', CategorySchema);