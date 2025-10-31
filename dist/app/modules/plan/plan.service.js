"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageService = void 0;
const http_status_codes_1 = require("http-status-codes");
const plan_model_1 = require("./plan.model");
const mongoose_1 = __importDefault(require("mongoose"));
const stripe_1 = __importDefault(require("../../../config/stripe"));
const createStripeProductCatalog_1 = require("../../../stripe/createStripeProductCatalog");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const deleteStripeProductCatalog_1 = require("../../../stripe/deleteStripeProductCatalog");
const subscription_model_1 = require("../subscription/subscription.model");
const createCheckoutSession_1 = require("../../../stripe/createCheckoutSession");
// Create plan in DB and Stripe Product
const createPlanToDB = async (payload) => {
    const productPayload = {
        title: payload.title,
        description: payload.description,
        duration: payload.duration,
        price: Number(payload.price),
    };
    const product = await (0, createStripeProductCatalog_1.createStripeProductCatalog)(productPayload);
    if (!product) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to create subscription product');
    }
    if (product) {
        payload.productId = product.productId;
        payload.priceId = product.priceId;
    }
    const result = await plan_model_1.Plan.create(payload);
    if (!result) {
        await stripe_1.default.products.del(product.productId);
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to created Package');
    }
    return result;
};
const creatSession = async (user, planId) => {
    const url = await (0, createCheckoutSession_1.createCheckoutSession)(user, planId);
    return { url };
};
// Update plan in DB and Stripe Product
const updatePlanToDB = async (id, payload) => {
    var _a, _b, _c;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid ID');
    }
    // 1. Find existing plan
    const existingPlan = await plan_model_1.Plan.findById(id);
    if (!existingPlan) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Plan not found');
    }
    // Access properties directly as they are now primitive types
    const productId = existingPlan.productId || undefined;
    const currentTitle = existingPlan.title || undefined;
    const currentDescription = existingPlan.description || undefined;
    // 2. Update Product on Stripe (if title/description changed)
    if (payload.title || payload.description) {
        if (!productId) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Missing Stripe Product ID');
        }
        await stripe_1.default.products.update(productId, {
            name: (_a = payload.title) !== null && _a !== void 0 ? _a : currentTitle,
            description: (_b = payload.description) !== null && _b !== void 0 ? _b : currentDescription,
        });
    }
    // 3. If price changes → create new Stripe Price
    if (payload.price && payload.price !== existingPlan.price) {
        if (!productId) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Missing Stripe Product ID');
        }
        const price = await stripe_1.default.prices.create({
            unit_amount: Number(payload.price) * 100, // ensure number
            currency: 'gbp', // ✅ UK Pound
            recurring: {
                interval: ((_c = payload.paymentType) === null || _c === void 0 ? void 0 : _c.toLowerCase()) === 'yearly' ? 'year' : 'month',
            },
            product: productId,
        });
        payload.priceId = price.id;
    }
    // 4. Update MongoDB
    const result = await plan_model_1.Plan.findByIdAndUpdate(id, { $set: payload }, { new: true });
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to update plan in DB');
    }
    return result;
};
// Get plan from DB
const getPlanFromDB = async (paymentType) => {
    const query = {
        status: 'Active',
    };
    if (paymentType) {
        query.paymentType = paymentType;
    }
    const result = await plan_model_1.Plan.find(query);
    const activeSubscriptions = await subscription_model_1.Subscription.countDocuments({
        status: 'active',
    });
    const expiredSubscriptions = await subscription_model_1.Subscription.countDocuments({
        status: 'expired',
    });
    const failedSubscriptions = await subscription_model_1.Subscription.countDocuments({
        status: 'cancel',
    });
    const meta = {
        activeSubscriptions,
        expiredSubscriptions,
        failedSubscriptions,
    };
    return {
        plans: result,
        meta,
    };
};
// Get plan details from DB
const getPlanDetailsFromDB = async (id) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid ID');
    }
    const result = await plan_model_1.Plan.findById(id);
    return result;
};
// Delete plan from DB and Stripe
const deletePlanToDB = async (id) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid ID');
    }
    const isExist = await plan_model_1.Plan.findById(id);
    if (!isExist) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Plan not found');
    }
    if (isExist.productId) {
        await (0, deleteStripeProductCatalog_1.deleteStripeProductCatalog)(isExist.productId);
    }
    const result = await plan_model_1.Plan.findByIdAndUpdate({ _id: id }, { status: 'Delete' }, { new: true });
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to deleted Package');
    }
    return result;
};
exports.PackageService = {
    createPlanToDB,
    updatePlanToDB,
    getPlanFromDB,
    getPlanDetailsFromDB,
    deletePlanToDB,
    creatSession,
};
