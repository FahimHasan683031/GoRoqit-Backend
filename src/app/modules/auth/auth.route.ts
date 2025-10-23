import express from 'express'
import passport from 'passport'
import { PassportAuthController } from './passport.auth/passport.auth.controller'
import { CustomAuthController } from './custom.auth/custom.auth.controller'
import validateRequest from '../../middleware/validateRequest'
import { AuthValidations } from './auth.validation'
import { USER_ROLES } from '../../../enum/user'
import auth, { tempAuth } from '../../middleware/auth'
import { UserValidations } from '../user/user.validation'
import fileUploadHandler from '../../middleware/fileUploadHandler'
import { getSingleFilePath } from '../../../shared/getFilePath'

const router = express.Router()

router.post(
  '/signup',
   fileUploadHandler(),
  async (req, res, next) => {
    try {
      const image = getSingleFilePath(req.files, "image");
      req.body = {
        image,
        ...req.body
      };
      next();
    } catch (error) {
      res.status(400).json({ message: "Failed to upload Category Image" });
    }
  },
  validateRequest(UserValidations.userSignupSchema),
  CustomAuthController.createUser,
)
router.post(
  '/admin-login',
  validateRequest(AuthValidations.loginZodSchema),
  CustomAuthController.adminLogin,
)
router.post(
  '/login',
  validateRequest(AuthValidations.loginZodSchema),
  passport.authenticate('local', { session: false }), 
  PassportAuthController.login,
)

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
)

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  PassportAuthController.googleAuthCallback,
)

router.post(
  '/verify-account',
  validateRequest(AuthValidations.verifyAccountZodSchema),
  CustomAuthController.verifyAccount,
)

router.post(
  '/custom-login',
  validateRequest(AuthValidations.loginZodSchema),
  CustomAuthController.customLogin,
)

router.post(
  '/forget-password',
  validateRequest(AuthValidations.forgetPasswordZodSchema),
  CustomAuthController.forgetPassword,
)
router.post(
  '/reset-password',
  validateRequest(AuthValidations.resetPasswordZodSchema),
  CustomAuthController.resetPassword,
)

router.post(
  '/resend-otp',
 
  validateRequest(AuthValidations.resendOtpZodSchema),
  CustomAuthController.resendOtp,
)

router.post(
  '/change-password',
  auth(USER_ROLES.ADMIN, USER_ROLES.APPLICANT, USER_ROLES.RECRUITER),
  validateRequest(AuthValidations.changePasswordZodSchema),
  CustomAuthController.changePassword,
)

router.delete(
  '/delete-account',
  auth(USER_ROLES.ADMIN, USER_ROLES.RECRUITER, USER_ROLES.APPLICANT),
  validateRequest(AuthValidations.deleteAccount),
  CustomAuthController.deleteAccount,
)
router.post('/access-token', CustomAuthController.getAccessToken)

router.post('/social-login', validateRequest(AuthValidations.socialLoginZodSchema), CustomAuthController.socialLogin)

export const AuthRoutes = router
