import express from "express";
import { SubscriptionController } from "./subscription.controller";
import auth from "../../middleware/auth";
import { USER_ROLES } from "../user/user.interface";
const router = express.Router();

router.get("/", 
     auth(USER_ROLES.ADMIN, USER_ROLES.APPLICANT, USER_ROLES.RECRUITER),
    SubscriptionController.subscriptions
);

router.get("/my-plan", 
    auth(USER_ROLES.ADMIN, USER_ROLES.APPLICANT, USER_ROLES.RECRUITER), 
    SubscriptionController.subscriptionDetails
);

export const SubscriptionRoutes = router;