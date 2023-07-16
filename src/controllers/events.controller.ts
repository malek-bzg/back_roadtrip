import { Request, Response } from "express";

import { PrismaClient } from '@prisma/client';
import multer from "multer";
import { tokenSecret } from "../../config";
import { NextFunction } from 'express';


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
const upload = multer({ storage }).single('eventPicture');

export const eventController = {

  createEvent: async (req: Request, res: Response) => {
    try {
      upload(req, res, async (err) => {
        if (err) {
          return res.status(400).send({ message: "Error uploading file" });
        }

        const { nameDestination, Dateofdeparture, prix, description, maximumNumberOfplaces } = req.body;
        const eventPicturePath = req.file ? req.file.path : null;


        const dateDeparture = new Date(Dateofdeparture);


        const event = await prisma.event.create({
          data: {
            nameDestination,
            Dateofdeparture: new Date(Dateofdeparture),
            prix,
            description,
            maximumNumberOfplaces,
            eventPicture: eventPicturePath,
          },
        });
        return res.json({ event });
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "An error occurred while creating the event" });
    }

    },

    async showCreateEventPage  (req: Request, res: Response)  {
      res.render('events/createEvent');
    },  
    async showUpdateEventPage  (req: Request, res: Response)  {
      res.render('events/updateEvent');
    },
  async index(req: Request, res: Response) {
    console.log(req.baseUrl);
    try {
    const events = await prisma.event.findMany();
    if(!req.baseUrl.includes( "api")){
      return res.render('events/event', {events});
    }
    return res.json(events);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "An error occurred while retrieving users" });
  }
    
  },

  async findUniqueEvent(req: Request, res: Response){
    const paramId = req.params.id;

    const uniqueEvent = await prisma.event.findUnique({
        where: {
            id:paramId,
        },
    });

    return res.json({uniqueEvent: uniqueEvent})
  },

  async updateEvent(req: Request, res: Response){
    const paramId= req.params.id;
    const nameDestination = req.body.nameDestination;
    const Dateofdeparture = req.body.Dateofdeparture;
    const prix = req.body.prix;
    const description = req.body.description;
    const maximumNumberOfplaces = req.body.maximumNumberOfplaces;
    
    const updateEvent = await prisma.event.update({
        data: {
            nameDestination: nameDestination,
            Dateofdeparture: Dateofdeparture,
            prix: prix,
            description: description,
            maximumNumberOfplaces:maximumNumberOfplaces,        
        },
        where:{
            id: paramId,
        },
    });
    return res.json({updateEvent: updateEvent});
  },

  async editEventPicture (req: Request, res: Response, next: NextFunction){
    try {
      const file = req.file as Express.Multer.File; // Type assertion to ensure req.file is not undefined
      const eventId = req.params.eventId;
  
      const editEventPicture = await prisma.event.update({
        where: { id: eventId },
        data: {
          eventPicture: file.filename,
        },
      });
  
      res.send({ editEventPicture });
    } catch (error) {
      next(error);
    } finally {
      await prisma.$disconnect();
    }
  },

  async deletEvent(req: Request, res: Response){
    const paramId = req.params.id;

    const deletedEvent = await prisma.event.delete({
        where: {
            id : paramId,
        },
    });

    return res.json({deletedEvent: deletedEvent});
  },

  
 
};