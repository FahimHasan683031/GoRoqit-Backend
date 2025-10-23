import express from "express";
import { PlanController } from "./plan.controller";
import { createPlanZodValidationSchema, updatePlanZodValidationSchema } from "./plan.validation";
import auth from "../../middleware/auth";
import { USER_ROLES } from "../user/user.interface";
import validateRequest from "../../middleware/validateRequest";
import { createCheckoutSession } from "../../../stripe/createCheckoutSession";
const router = express.Router()

router.route("/")
    .post(
        auth(USER_ROLES.ADMIN),
        validateRequest(createPlanZodValidationSchema),
        PlanController.createPlan
    )
    .get(
         auth(USER_ROLES.ADMIN, USER_ROLES.RECRUITER),
        PlanController.getPlan
    )

router.post(
    "/create-checkout-session",
    auth( USER_ROLES.RECRUITER),
    PlanController.createCheckoutSession
)

router
    .route("/:id")
    .patch( 
        auth(USER_ROLES.ADMIN),
        validateRequest(updatePlanZodValidationSchema),
        PlanController.updatePlan
    )
    .delete( auth(USER_ROLES.ADMIN), PlanController.deletePlan)

export const PlanRoutes = router;