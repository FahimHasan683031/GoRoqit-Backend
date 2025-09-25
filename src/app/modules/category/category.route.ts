import express from "express";
import { createCategoryController, deleteCategoryController, getCategoriesController, updateCategoryController } from "./category.controller";
import { createCategoryValidationSchema, updateCategoryValidationSchema } from "./category.validation";
import auth from "../../middleware/auth";
import { USER_ROLES } from "../user/user.interface";
import validateRequest from "../../middleware/validateRequest";
const router = express.Router()

router.route("/")
    .post(
        auth(USER_ROLES.ADMIN, USER_ROLES.APPLICANT, USER_ROLES.RECRUITER, USER_ROLES.GUEST),
        validateRequest(createCategoryValidationSchema),
        createCategoryController
    )
    .get(
        getCategoriesController
    )

router
    .route("/:id")
    .patch( auth(USER_ROLES.ADMIN, USER_ROLES.APPLICANT, USER_ROLES.RECRUITER,USER_ROLES.GUEST), updateCategoryController)
    .delete( auth(USER_ROLES.ADMIN, USER_ROLES.APPLICANT, USER_ROLES.RECRUITER,USER_ROLES.GUEST),deleteCategoryController)

export const categoryRoutes = router;