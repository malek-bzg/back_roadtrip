import express from 'express';
import { dashboardController } from "../controllers/dashboard.controller"


const router = express.Router();

router.get("/", dashboardController.showDashboardPage );


export default router;