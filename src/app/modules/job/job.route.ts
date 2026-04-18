import express from 'express';
import { JobController } from './job.controller';
import { JobValidations } from './job.validation';
import validateRequest from '../../middleware/validateRequest';
import auth from '../../middleware/auth';
import { USER_ROLES } from '../../../enum/user';
import { validateJobCreation } from '../../middleware/validateJobCreation';


const router = express.Router();

router.get(
  '/',
  JobController.getAllJobs
);

router.get(
  '/my-jobs',
  auth(USER_ROLES.RECRUITER),
  JobController.getMyJobs
);

router.get(
  '/get-jobs-by-distance',
  auth(USER_ROLES.APPLICANT),
  JobController.getJobsByDistance
);

router.get(
  '/recruiter-statistics',
  auth(USER_ROLES.RECRUITER),
  JobController.getRecruiterStatistics
);

router.get(
  '/:id',
  JobController.getSingleJob
);

router.post(
  '/',
  auth(
     USER_ROLES.ADMIN,
    USER_ROLES.RECRUITER,
  ),
  validateJobCreation,
  validateRequest(JobValidations.createJobZodSchema),
  JobController.createJob
);

router.patch(
  '/:id',
  auth(
    USER_ROLES.ADMIN,
    USER_ROLES.RECRUITER
  ),
  
  validateRequest(JobValidations.updateJobZodSchema),
  JobController.updateJob
);

router.delete(
  '/:id',
  auth(
     USER_ROLES.ADMIN,
    USER_ROLES.RECRUITER
  ),
  JobController.deleteJob
);

export const JobRoutes = router;