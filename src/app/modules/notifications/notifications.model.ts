import { Schema, model } from 'mongoose'
import { INotification, NotificationModel } from './notifications.interface'

const notificationSchema = new Schema<INotification, NotificationModel>(
  {
    to: { type: Schema.Types.ObjectId, ref: 'User' , populate: 'name image' },
    from: { type: Schema.Types.ObjectId, ref: 'User', populate: 'name image' },
    title: { type: String },
    body: { type: String },
    isRead: { type: Boolean },
  },
  {
    timestamps: true,
  },
)

export const Notification = model<INotification, NotificationModel>(
  'Notification',
  notificationSchema,
)
