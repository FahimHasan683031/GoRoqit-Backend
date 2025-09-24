import express from 'express'
import { UserController } from './user.controller'
import validateRequest from '../../middleware/validateRequest'
import auth from '../../middleware/auth'
import { USER_ROLES } from '../../../enum/user'
import {
  fileAndBodyProcessorUsingDiskStorage,
} from '../../middleware/processReqBody'
import { UserValidations } from './user.validation'
import fileUploadHandler from '../../middleware/fileUploadHandler'
import { getSingleFilePath } from '../../../shared/getFilePath'

const router = express.Router()


router.patch(
  '/profile',
  auth(
    USER_ROLES.APPLICANT,
    USER_ROLES.ADMIN,
    USER_ROLES.RECRUITER,
  ),
   fileUploadHandler(),
  async (req, res, next) => {
    try {
      const resume = getSingleFilePath(req.files, "resume");
      const companyLogo = getSingleFilePath(req.files, "companyLogo");
      const image = getSingleFilePath(req.files, "image");
      req.body = {
        resume,
        companyLogo,
        image,
        ...req.body
      };
      next();
    } catch (error) {
      res.status(400).json({ message: "Failed to upload Category Image" });
    }
  },
  validateRequest(UserValidations.userUpdateSchema),
  UserController.updateProfile,
)
router.get('/',UserController.getAllUser),
// get single user
router.get('/:id',UserController.getSingleUser)
// update user role and create profile
router.patch(
  '/:id/role',
  UserController.updateUserRoleAndCreateProfile,
)
// delete user
router.delete('/:id',UserController.deleteUser)

export const UserRoutes = router
