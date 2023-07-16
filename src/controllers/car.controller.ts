
import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import multer from "multer";

const prisma = new PrismaClient();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/images/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.jpg');
  }
});

const upload = multer({ storage }).single('carPicture');
export const carController = {
    async createCar(req: Request, res: Response){
        try {
            upload(req, res, async (err) => {
              if (err) {
                return res.status(400).send({ message: "Error uploading file" });
              }
      
              const { name, color, userId } = req.body;
              const carPicturePath = req.file ? req.file.path : null;
      
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

    async index(req:Request, res:Response){
      console.log(req.baseUrl);
      try {
        const cars = await prisma.car.findMany();
        if(!req.baseUrl.includes("api")){
          return res.render('cars/car', {cars});
        }
        return res.json(cars);
      } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "An error occurred while retrieving users" });
      }
    },

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
              carPicture: file.filename,
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
        
        const paramId = req.params.id;
        const deletedCar = await prisma.car.delete({
            where: {
                id : paramId,
            },
        });
    
        return res.json({deletedCar: deletedCar});
      },   
      
};