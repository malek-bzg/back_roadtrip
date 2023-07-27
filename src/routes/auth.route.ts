import express from "express";
import { signInView, signIn } from "../controllers/auth.controller";

const router = express.Router();

router.route("/sign-in").get(signInView);
router.route("/sign-in").post(signIn);

export default router;
