import express, { Express, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import userRoutes from "./routes/user.routes";
import eventRoutes from "./routes/events.routes";
import carRoutes from "./routes/car.routes";
import LocationRoutes from "./routes/location.routes";
import userViewRoutes from "./routes/user.views.routes"; 
import eventsViewRoutes from "./routes/events.views.routes";
import authRoutes from "./routes/auth.routes";
import carsViewRoutes from "./routes/car.views.routes";
import dashRoutes from "./routes/dash.routes";
import isAuthenticated from "../auth.middleware"; // Utilisez le chemin approprié pour votre fichier auth.middleware
import session, { SessionOptions } from 'express-session';
import { tokenSecret } from "../config"; // Utilisez le chemin approprié pour votre fichier config

const path = require("path");
const sessionOptions: SessionOptions = {
  secret: tokenSecret,
  resave: false,
  saveUninitialized: true,
};

class App {
  public server: Express;

  constructor() {
    this.server = express();
    this.middlewares();
    this.server.set('views', path.join(__dirname, 'views'));
    this.server.set('view engine', 'ejs');
    this.server.use(express.static(path.join(__dirname, 'public', 'assets')));
    this.server.use(express.static(path.join(__dirname, 'public')));
    this.routes();
  }

  private middlewares(): void {
    this.server.use(bodyParser.urlencoded({ extended: false }));
    this.server.use(bodyParser.json());
    this.server.use(session(sessionOptions));
  }

  private routes(): void {
    this.server.use("/api/users", userRoutes);
    this.server.use("/users", userViewRoutes);
    this.server.use("/api/users/confirmation/", userRoutes);
    this.server.use("/api/cars", carRoutes);
    this.server.use("/cars", carsViewRoutes);
    this.server.use("/api/location", LocationRoutes);
    this.server.use("/sign-in", authRoutes);
    this.server.use("/api/dashboard" , dashRoutes)
    this.server.use("/api/sign-in", authRoutes);
    this.server.use("/api/events", eventRoutes);
    this.server.use("/events", eventsViewRoutes);

    // Middleware isAuthenticated est utilisé uniquement pour la route "/dashboard"
    this.server.use("/", isAuthenticated, (req: Request, res: Response) => {
      res.status(200).render("dashboard", { title: "Dashboard" });
    });

    // Gestion des erreurs globales
    this.server.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      console.error(err.stack);
      res.status(500).json({ message: "Une erreur s'est produite sur le serveur." });
    });

  }
}

export default new App().server;
