import express from 'express';
import { userController } from '../controllers/user.controller';
import { upload } from '../middlewares/storage';
import app from '../app';
import bodyParser from 'body-parser';
import { carController } from '../controllers/car.controller';

const router = express.Router();




router.get("/", carController.index)



export default router;