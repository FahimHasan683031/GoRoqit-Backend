import { Model, Types } from 'mongoose';

export type ISubscription = {
    _id?:string;
    customerId: string;
    price: number;
    plan: Types.ObjectId;
    trxId?: string;
    subscriptionId: string;
    status: 'expired' | 'active' | 'cancel';
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
};

export type SubscriptionModel = Model<ISubscription, Record<string, unknown>>;