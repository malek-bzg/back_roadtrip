import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { tokenSecret } from "../../config";
import express from 'express';
import bodyParser from 'body-parser';
import { PrismaClient } from "@prisma/client";
import multer from "multer";

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

export const authController = {
  signInView: (req: Request, res: Response) => {
    res.status(200).render("auth/signIn", { layout: "./layouts/auth", title: "Sign in" });
  },

  signIn: async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        // Check if the user exists and has the role "Admin"
        if (!user || user.role !== "Admin") {
            return res.status(403).json({ message: "Only users with the 'Admin' role can perform authentication." });
        }

    // Vérifier si le mot de passe correspond (Notez que cela n'utilise pas bcrypt)
    if (user && user.password === password) {
      const token = jwt.sign({ email: email }, tokenSecret, { expiresIn: '36000000' });

      if (!user.isVerified) {
          return res.status(200).json({ token, user, message: 'Success' });
      } else {
          return res.status(200).json({ user, message: 'Email non vérifié' });
      }
  } else {
      return res.status(403).json({ message: 'Mot de passe ou email incorrect' });
  }
} catch (error) {
  console.log(error);
  return res.status(500).json({ message: "Une erreur s'est produite lors de la connexion" });
}
},


};
