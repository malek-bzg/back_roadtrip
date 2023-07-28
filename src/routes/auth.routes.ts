import express from "express";
import { signInView, signIn } from "../controllers/auth.controller";
import { upload } from '../middlewares/storage';


const router = express.Router();

router.use(express.json())
router.route("/sign-in").get(signInView);
router.route("/sign-in").post(signIn);

export default router;
