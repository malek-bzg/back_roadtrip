import multer from "multer";
import jwt from 'jsonwebtoken';
import { tokenSecret } from "../../config";
import { Request, Response, NextFunction } from 'express';


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/images') // Chemin de destination des fichiers uploadés
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + '.jpg') // Nom du fichier avec extension (par exemple : "fieldname-1623445678743-123456789.jpg")
  }
});

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const { user } = req;

  if (user && user.role === 'Admin') {
    next();
  } else {
    return res.status(403).json({ message: "Vous n'avez pas les droits d'administration. Accès refusé." });
  }
}

const upload = multer({ storage: storage });

export { upload };
