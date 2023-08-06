import express from 'express';
import { userController } from '../controllers/user.controller';
import { upload } from '../middlewares/storage';
import app from '../app';
import bodyParser from 'body-parser';
import { carController } from '../controllers/car.controller';

const router = express.Router();


router.put("/edit-car-picture/:carId", upload.single('carPicture'), carController.editcarPicture)
router.delete("carPicture/:carId",carController.deleteCarPicture)
router.get("/", carController.index)
router.delete("/:id", carController.deletCar);


export default router;