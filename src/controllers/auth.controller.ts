// auth.controller.ts

import { Request, Response } from "express";
import prisma from "../services/prisma";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { tokenSecret } from "../../config";

export const signInView = (req: Request, res: Response) => {
  res.status(200).render("auth/signIn", { layout: "./layouts/auth", title: "Sign in" });
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ message: 'Email et/ou mot de passe manquants' });
    }
    const user = await prisma.user.findUnique({
      where: {
        email: email
      }
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ email: email }, tokenSecret, { expiresIn: '36000000' });

      if (user.isVerified) {
        // Vous n'avez pas besoin de rendre une vue et de renvoyer des données JSON en même temps.
        // Vous pouvez simplement rediriger vers une nouvelle page après la connexion réussie.
        return res.redirect('/dashboard');
      } else {
        // Rediriger vers une page d'erreur ou afficher un message d'erreur pour l'email non vérifié
        return res.status(200).send({ user, message: 'Email non vérifié' });
      }
    } else {
      // Rediriger vers une page d'erreur ou afficher un message d'erreur pour le mot de passe incorrect
      return res.status(403).send({ message: 'Mot de passe ou email incorrect' });
    }
  } catch (error) {
    console.log(error);
    // Rediriger vers une page d'erreur ou afficher un message d'erreur pour toute autre erreur
    return res.status(500).send({ message: "Une erreur s'est produite lors de la connexion" });
  }
};
