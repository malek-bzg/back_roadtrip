
import express, { Router, Request, Response } from 'express';
import { carController } from "../controllers/car.controller"
import { upload } from '../middlewares/storage';

const router = express.Router();
router.get("/", carController.index );
router.delete("/carPicture/:carId", carController.deleteCarPicture);
router.post("/create", carController.createCar);
router.get("/:id", carController.findUniqueCar);
router.put("/:id", carController.updateCar);
router.put("/edit-car-picture/:carId", upload.single('carPicture'), carController.editcarPicture)
router.delete("/:id", carController.deletCar);
//router.get("/cars" , carController.showCarPage)


export default router;
