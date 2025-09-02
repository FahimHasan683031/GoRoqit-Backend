import express from 'express';
import { JobController } from './job.controller';
import { JobValidations } from './job.validation';
import validateRequest from '../../middleware/validateRequest';
import auth from '../../middleware/auth';
import { USER_ROLES } from '../../../enum/user';


const router = express.Router();

router.get(
  '/',
  // auth(
  //   USER_ROLES.ADMIN,
  //   USER_ROLES.RECRUITER
  // ),
  JobController.getAllJobs
);

router.get(
  '/:id',
  // auth(
  //    USER_ROLES.ADMIN,
  //   USER_ROLES.RECRUITER
  // ),
  JobController.getSingleJob
);

router.post(
  '/',
  auth(
     USER_ROLES.ADMIN,
    USER_ROLES.RECRUITER,
    USER_ROLES.APPLICANT
  ),
  
  validateRequest(JobValidations.createJobZodSchema),
  JobController.createJob
);

router.patch(
  '/:id',
  // auth(
  //   USER_ROLES.ADMIN,
  //   USER_ROLES.RECRUITER
  // ),
  
  validateRequest(JobValidations.updateJobZodSchema),
  JobController.updateJob
);

router.delete(
  '/:id',
  // auth(
  //    USER_ROLES.ADMIN,
  //   USER_ROLES.RECRUITER
  // ),
  JobController.deleteJob
);

export const JobRoutes = router;