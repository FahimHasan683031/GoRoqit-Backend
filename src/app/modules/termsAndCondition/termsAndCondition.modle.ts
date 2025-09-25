import { Schema, model } from 'mongoose'
import ITermsAndCondition from './termsAndCondition.interface'

const termsAndConditionSchema = new Schema<ITermsAndCondition>(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

export const TermsAndCondition = model<ITermsAndCondition>(
  'TermsAndCondition',
  termsAndConditionSchema,
)