import express from "express";
import { createCategoryController, deleteCategoryController, getCategoriesController, updateCategoryController } from "./category.controller";
import { createCategoryValidationSchema } from "./category.validation";
import auth from "../../middleware/auth";
import { USER_ROLES } from "../user/user.interface";
import validateRequest from "../../middleware/validateRequest";
const router = express.Router()

router.route("/")
    .post(
        auth(USER_ROLES.ADMIN),
        validateRequest(createCategoryValidationSchema),
        createCategoryController
    )
    .get(
        getCategoriesController
    )

router
    .route("/:id")
    .patch( auth(USER_ROLES.ADMIN), updateCategoryController)
    .delete( auth(USER_ROLES.ADMIN),deleteCategoryController)

export const categoryRoutes = router;