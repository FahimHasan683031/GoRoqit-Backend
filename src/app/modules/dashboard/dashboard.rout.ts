import express from 'express'
import { DashboardControllers } from './dashboard.controller'


const router = express.Router()

router.get('/statistics', DashboardControllers.getDashboardStatistics)

export const DashboardRoutes = router