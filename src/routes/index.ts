import express, { Router, Request, Response } from "express";
import userRoute from "./user.routes";
import eventRoute from "./events.routes";
import authRoute from "./auth.routes";
import carRoutes from"./car.routes";
import userViewRoutes from "./user.views.routes"
import eventRoutes from "./events.routes"


export {userRoute};
const router = express.Router();
export {userViewRoutes};
export {carRoutes};
export {eventRoutes};

// router.use(token);
// router.use("/users", userRoute);
// router.use("/events", eventRoute);
router.use("/", authRoute);
router.use("/", (req: Request, res: Response) => {
  res.status(200).render("dashboard", { title: "Dashboard" });
});

export default router;
