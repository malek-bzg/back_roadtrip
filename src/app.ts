import express, { Express } from "express";
import bodyParser from "body-parser";
import userRoutes from "./routes/user.routes";
import eventRoutes from "./routes/events.routes";
import carRoutes from "./routes/car.routes";
import LocationRoutes from "./routes/location.routes";
import userViewRoutes from "./routes/user.views.routes"; 
import eventsViewRoutes from "./routes/events.views.routes";
import authRoutes from "./routes/auth.routes"
import carsViewRoutes from "./routes/car.views.routes"

//import { carRoutes, userRoutes, OrganisateurRoutes, eventRoutes , userViewRoutes  } from "./routes";

const path = require("path");

class App {
  public server: Express;

  constructor() {
    this.server = express();
    this.middlewares();
    this.server.set('views', path.join(__dirname, 'views')); 
   // this.server.use(express.static(path.join(__dirname, 'public')));
    this.server.use(express.static(path.join(__dirname, 'public', 'assets')));
    this.server.use(express.static(path.join(__dirname, 'public')));
    this.server.set('view engine' , 'ejs');
   this.routes();
  }

  private middlewares(): void {
    this.server.use(bodyParser.urlencoded({ extended: false }));
    this.server.use(bodyParser.json());
  }
  

  private routes(): void {
    
    this.server.use("/api/users", userRoutes);
    this.server.use("/users", userViewRoutes);
    this.server.use("/api/users/confirmation/", userRoutes);
    //this.server.use("/dashboard", dashboardViewsRoutes);
   // this.server.use("/api/login", userRoutes);
    this.server.use("/api/cars", carRoutes);
    this.server.use("/cars", carsViewRoutes);
    this.server.use("/api/location", LocationRoutes);
   /// this.server.use("/organisateurs", organisateurViewRoutes );
   this.server.use("/sign-in" , authRoutes)
    this.server.use("/api/events", eventRoutes);
    this.server.use("/events" , eventsViewRoutes);
    

  }
}

export default new App().server;
