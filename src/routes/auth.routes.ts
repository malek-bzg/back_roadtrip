import express from "express";
//import { signInView, signIn } from "../controllers/auth.controller";
import { authController } from '../controllers/auth.controller';

const app = express();

const router = express.Router();

router.use(express.json())
router.get("/sign-in", authController.signInView);
//router.get("/sign-in", authController.signIn);
router.post("/api/sign-in", authController.signIn);





export default router;
