import { BodyParser } from 'body-parser';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import MySessionData from './session';
import { tokenSecret } from "./config";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  // Vérifiez si la propriété 'token' existe dans la session
  const token = (req.headers.authorization?.split(' ')[1] );
  //console.log(res.json());

  if (!token) {
    return  res.status(401).json({ message: "Token manquant. Accès refusé." });
  }

  jwt.verify(token, tokenSecret, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({ message: "Token invalide. Accès refusé." });
    }
    // Le token est valide, ajouter les données décodées à l'objet "req"
    req.user = decoded;
    next();
  });
};

export default isAuthenticated;
