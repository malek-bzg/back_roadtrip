import express, { Request, Response, NextFunction } from "express";
import userRoutes from "./routes/user.routes";
import userViewsRoutes from "./routes/user.views.routes";
import eventRoutes from "./routes/events.routes";
import eventViewsRoutes from "./routes/events.views.routes";
import carViewsRoutes from "./routes/car.views.routes";
import cors from "cors";
import path from "path";
import { userController } from "./controllers/user.controller";
import { eventController } from "./controllers/events.controller";
import { carController } from "./controllers/car.controller";
import { authController } from "./controllers/auth.controller";
import authRoute from "./routes/auth.routes";
import isAuthenticated from "../auth.middleware";
import session, { SessionOptions } from 'express-session';
import carRoutes from "./routes/car.routes";

const expressLayouts = require("express-ejs-layouts");
const app = express();
const port = process.env.PORT || 3000;

// Middleware pour la gestion des vues
app.use(expressLayouts);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

// Middleware pour le traitement des données POST
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Middleware pour gérer les requêtes CORS
app.use(cors({ origin: 'http://localhost:3000' }));

// Middleware pour gérer les sessions
const sessionOptions: SessionOptions = {
  secret: 'ma_clé_secrète_pour_express_session',
  resave: false,
  saveUninitialized: true,
};
app.use(session(sessionOptions));

// Routes
app.post("/api/users", userController.createUser);
app.post("/api/events", eventController.createEvent);
app.post("/api/cars", carController.createCar);
app.post("/sign-in", authController.signIn);
app.use(express.static(path.join(__dirname, "../public")));
app.use("/api/users", userRoutes);
app.use("/users", userViewsRoutes);
app.use("/events", eventViewsRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/cars", carRoutes);
app.use("/cars", carViewsRoutes);
app.use("/login", userRoutes);
app.use("/sign-in", authRoute);
app.get('/dashboard', isAuthenticated, (req, res) => {
  // Le middleware isAuthenticated a déjà vérifié l'authentification,
  // donc vous pouvez accéder aux données de l'utilisateur via "req.user"
  res.status(200).render('dashboard', { title: 'Dashboard', user: req.user });
});
app.use("/", authRoute);

// Gestion des erreurs globales
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Une erreur s'est produite sur le serveur." });
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
