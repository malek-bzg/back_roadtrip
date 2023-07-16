import express, { Router, Request, Response } from 'express';
import { locationController } from "../controllers/location.controller"
import { upload } from '../middlewares/storage';

const router = express.Router();
router.get("/", locationController.index );
router.post("/create", locationController.createLocation);
router.get("/:id", locationController.findUniqueLocation);
router.put("/:id", locationController.updateLocation);
router.delete("/:id", locationController.deleteLocation);
export default router;