
import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import fs from "fs";

const prisma = new PrismaClient();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/images');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.jpg');
  }
});

const upload = multer({ storage }).single('carPicture');
export const carController = {
  async createCar(req: Request, res: Response) {
    try {
      upload(req, res, async (err) => {
        if (err) {
          return res.status(400).send({ message: err });
        }
  
        const { name, color, userId } = req.body;
  
        // Vérifier si l'utilisateur existe dans la base de données avant de créer la voiture
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
          return res.status(400).send({ message: "User not found" });
        }
  
        const carPicturePath = req.file ? `/uploads/images/${req.file.filename}` : null;
        console.log(req.file)
  
        const car = await prisma.car.create({
          data: {
            name,
            color,
            userId,
            carPicture: carPicturePath,
          },
        });
  
        return res.json({ car });
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "An error occurred while creating the car" });
    }
  },
  

  async index(req: Request, res: Response) {
    console.log(req.baseUrl);
    try {
      const cars = await prisma.car.findMany({
        include: {
          user: true // Inclure les données de l'utilisateur associé
        }
      });
  
      if (!req.baseUrl.includes("api")) {
        return res.render('cars/index', { cars });
      }
  
      return res.json(cars);
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Une erreur s'est produite lors de la récupération des utilisateurs" });
    }
  },
  
    /*async showCarPage  (req: Request, res: Response)  {
      try {
        const carId = req.params.id;
        const car = await prisma.car.findUnique({
            where: { id: carId },
            include: {
              user: true,
            },
        });
  
        if (!car) {
            return res.status(404).json({ error: 'voiture non trouvé' });
        }
        console.log(car)
  
        res.render('cars/index', { car }); // Passer les données de l'utilisateur à la vue
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'voiture', error);
        return res.status(500).json({ error: 'Erreur lors de la récupération de l\'voiture' });
    }
  },*/

    async findUniqueCar(req: Request, res: Response){
        const paramId = req.params.id;
    
        const uniqueCar = await prisma.car.findUnique({
            where: {
                id:paramId,
            },
        });
    
        return res.json({uniqueCar: uniqueCar})
      },

    async updateCar(req: Request, res: Response){
        const paramId= req.params.id;
        const name = req.body.name;
        const color = req.body.color;
        const userId = req.body.userId;
        const updateCar = await prisma.car.update({

            data: {
                name:name,
                color:color,
                userId: userId,
                
            },
            where:{
                id: paramId,
            },
        });
    
        return res.json({updateCar: updateCar});
      },
      async editcarPicture   (req: Request, res: Response, next: NextFunction){
        try {
          const file = req.file as Express.Multer.File; // Type assertion to ensure req.file is not undefined
          const carId = req.params.carId;
      
          const carPicture_update = await prisma.car.update({
            where: { id: carId },
            data: {
              carPicture: req.file ? `/uploads/images/${req.file.filename}` : null,
            },
          });
      
          res.send({ carPicture_update });
        } catch (error) {
          next(error);
        } finally {
          await prisma.$disconnect();
        }
      },
    
      async deletCar(req: Request, res: Response){
        try {
          const paramId = req.params.id;
      
          // Vérifiez si la voiture existe avant de la supprimer
          const existingCar = await prisma.car.findUnique({
            where: {
              id: paramId,
            },
          });
      
          if (!existingCar) {
            return res.status(404).json({ error: "La voiture n'a pas été trouvée." });
          }
      
          // Supprimez la voiture
          const deletedCar = await prisma.car.delete({
            where: {
              id: paramId,
            },
          });
      
          return res.json({ deletedCar });
        } catch (error) {
          console.error('Error:', error);
          return res.status(500).json({ error: 'Une erreur s\'est produite lors de la suppression de la voiture.' });
        }
      },  

      async deleteCarPicture(req: Request, res: Response) {
        try {
            const carId = req.params.carId;
    
            // Récupérer le chemin de l'image actuelle dans la base de données
            const car = await prisma.car.findUnique({ where: { id: carId }, select: { carPicture: true } });
    
            if (!car || !car.carPicture) {
                return res.status(404).send({ message: "Car or carPicture not found" });
            }
    
            // Supprimer l'image du dossier "public/uploads/images"
            const imagePath = `public${car.carPicture}`;
            fs.unlinkSync(imagePath); // Supprimez le fichier d'image du disque
    
            // Mettre à jour le champ "carPicture" pour qu'il soit null dans la base de données
            const updatedCar = await prisma.car.update({ where: { id: carId }, data: { carPicture: null } });
    
            return res.json({ updatedCar });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: "An error occurred while deleting the carPicture" });
        }
    }
    
    };

      
      
