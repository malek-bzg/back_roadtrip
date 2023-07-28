import express from "express";
import userRoutes from "./routes/user.routes";
import userViewsRoutes from "./routes/user.views.routes";
import eventRoutes from"./routes/events.routes";
import eventViewsRoutes from "./routes/events.views.routes";
import cors from "cors";
//import app from "./app";
import path from "path";

import { userController } from "./controllers/user.controller";
import { eventController } from "./controllers/events.controller";
import { carController } from "./controllers/car.controller";
import {signIn} from "./controllers/auth.controller"
import { carRoutes } from "./routes";
import authRoute from "./routes";

const app = express();
var expressLayouts = require("express-ejs-layouts");

app.use(expressLayouts);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");
app.use(cors({ origin: 'http://localhost:3000' }));


app.post("/api/users", userController.createUser);
app.post("/api/events",eventController.createEvent);
app.post("/api/cars",carController.createCar);
app.post("/login", signIn);

//app.post("/api/events", eventController.createEvent);
//app.use(express.static(path.join(__dirname, "../assets")));
app.use(express.static(path.join(__dirname, "../public")));

const port = process.env.PORT || 3000;



app.listen(port, () => {

  console.log(`Server running on port ${port}`);
});


app.use("/api/users", userRoutes);
app.use("/users", userViewsRoutes);
app.use("/events",eventViewsRoutes);
app.use("/api/events",eventRoutes);
app.use("/api/cars" , carRoutes);
app.use("/login" , userRoutes)
app.use("/", authRoute);
app.use("/", (req, res) => {
  res.status(200).render("dashboard", { title: "Dashboard" });
});


