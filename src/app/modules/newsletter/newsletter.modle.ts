import { model, Schema } from "mongoose"
import { INewsletter } from "./newsletter.interface"

const newsletterSchema = new Schema<INewsletter>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
)

export const Newsletter = model<INewsletter>('Newsletter', newsletterSchema)