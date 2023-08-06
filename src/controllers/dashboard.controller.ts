import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer, { Transporter } from 'nodemailer';
import { PrismaClient, Role, User } from '@prisma/client';
import multer from "multer";
import { tokenSecret } from "../../config";
import { NextFunction } from 'express';
import sgMail from '@sendgrid/mail';

const prisma = new PrismaClient();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/images/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.jpg');
  }
});

const upload = multer({ storage }).single('profilePicture');
export const dashboardController = {


    async showDashboardPage  (req: Request, res: Response)  {
        res.render('dashboard/index');
      },

}




