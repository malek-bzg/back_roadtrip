//import { tokenSecret } from './../../config';
import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { tokenSecret } from "../../config";
import express from 'express';
import bodyParser from 'body-parser';
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import session, { SessionData } from 'express-session';
import MySessionData from '../../session'

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
const secretKey = process.env.JWT_SECRET_KEY || 'ma_clé_secrète_pour_jwt_sign';


export const authController = {
  signInView: (req: Request, res: Response) => {
    res.status(200).render("auth/signIn", { layout: "./layouts/auth", title: "Sign in" });
  },

  signIn: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
     

      // Si l'authentification réussit, générer le token
      const token = jwt.sign({ email }, tokenSecret, { expiresIn: '1h' });
      console.log(token)

      // Stocker le token dans la session
      req.body = token;
      
      
      // Retourner une réponse JSON avec le token et un message de succès
      res.status(200).json({ token, message: 'Success' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: "Une erreur s'est produite lors de la connexion" });
    }
  }
};
