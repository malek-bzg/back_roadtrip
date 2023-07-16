import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import prisma from "../services/prisma";

export const locationController = {

    async createLocation(req: Request, res: Response) {
        try {
          const { longitude, latitude } = req.body;
        
          const location = await prisma.location.create({
            data: {
              longitude,
              latitude,
            },
          });
        
          return res.json({ location });
        } catch (error) {
          console.log(error);
          return res.status(500).send({ message: "Une erreur s'est produite lors de la création de la localisation" });
        }
      } ,
      async index(req: Request, res: Response) {
        try {
          const locations = await prisma.location.findMany();
          return res.json(locations);
        } catch (error) {
          console.log(error);
          return res.status(500).send({ message: "Une erreur s'est produite lors de la récupération des localisations" });
        }
      },

      async findUniqueLocation(req: Request, res: Response) {
        const paramId = req.params.id;
      
        try {
          const uniqueLocation = await prisma.location.findUnique({
            where: {
              id: paramId,
            },
          });
      
          if (!uniqueLocation) {
            return res.status(404).json({ message: "Localisation non trouvée" });
          }
      
          return res.json({ uniqueLocation });
        } catch (error) {
          console.log(error);
          return res.status(500).send({ message: "Une erreur s'est produite lors de la recherche de la localisation" });
        }
      },

      async updateLocation(req: Request, res: Response) {
        const paramId = req.params.id;
        const { longitude, latitude } = req.body;
      
        try {
          const updatedLocation = await prisma.location.update({
            where: {
              id: paramId,
            },
            data: {
              longitude,
              latitude,
            },
          });
      
          return res.json({ updatedLocation });
        } catch (error) {
          console.log(error);
          return res.status(500).send({ message: "Une erreur s'est produite lors de la mise à jour de la localisation" });
        }
      },

      async deleteLocation(req: Request, res: Response) {
        const paramId = req.params.id;
      
        try {
          const deletedLocation = await prisma.location.delete({
            where: {
              id: paramId,
            },
          });
      
          return res.json({ deletedLocation });
        } catch (error) {
          console.log(error);
          return res.status(500).send({ message: "Une erreur s'est produite lors de la suppression de la localisation" });
        }
      }
      
      
      
      
}