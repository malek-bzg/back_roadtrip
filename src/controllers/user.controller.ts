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
export const userController = {
  
  createUser: async (req: Request, res: Response) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).send({ message: "Error uploading file" });
            }
            const { Fname, Lname, phone_number, email, password, role } = req.body;
            const status = parseInt(req.body.status); // Convertir en nombre entier
            if (isNaN(status) || (status !== 0 && status !== 1)) {
              return res.status(400).send({ message: "Invalid status value" });
            }
            if (!Fname || !Lname || !phone_number || !email || !password || !role || status === undefined) {
                return res.status(400).send({ message: "Please fill in all the fields" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const existingUser = await prisma.user.findUnique({ where: { email } });
            //const existingPhoneNumber = await prisma.user.findUnique({ where: { phone_number } });

            if (existingUser) {
                return res.status(403).send({ message: "User already exists!" });
            }
            /*if (existingPhoneNumber) {
              return res.status(403).send({ message: "Phone number already in use!" });
            }*/

            const profilePicturePath = req.file ? `/uploads/images/${req.file.filename}` : null;

            const user = await prisma.user.create({
              data: {
                Fname,
                Lname,
                phone_number,
                email,
                password: hashedPassword,
                role,
                profilePicture: profilePicturePath,
                status: status, // Utiliser la valeur convertie en nombre entier
              },
            });

            const token = jwt.sign({ email }, config.token_secret, {
                expiresIn: '36000000',
            });

            await doSendConfirmationEmail(email, token);

            res.status(201).send({
                message: "User created successfully",
                user,
                token: jwt.verify(token, config.token_secret),
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "An error occurred while creating the user" });
    }

},

  
  async showCreateUserPage  (req: Request, res: Response)  {
    res.render('users/create');
  },

  index: async (req: Request, res: Response) => {
    console.log(req.baseUrl);
    try {
      const users = await prisma.user.findMany();
      if(!req.baseUrl.includes("api")){
        return res.render('users/index', {users, title: 'Users'});
      }
      return res.json(users);
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "An error occurred while retrieving users" });
    }
  },
  async showUpdateUserPage  (req: Request, res: Response)  {
    try {
      const userId = req.params.id;
      const user = await prisma.user.findUnique({
          where: { id: userId },
          include: {
            car: true,
          },
      });

      if (!user) {
          return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
      console.log(user)

      res.render('users/update', { user }); // Passer les données de l'utilisateur à la vue
  } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur', error);
      return res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur' });
  }
},

 
  async confirmation  (req: Request, res: Response)  {
    let token: any;
  
    try {
      token = jwt.verify(req.params.token, config.token_secret);
    } catch (e) {
      return res.status(400).send({
        message:
          "Le lien de vérification a peut-être expiré. Veuillez vérifier à nouveau votre email.",
      });
    }
  },

  async findUniqueUser(req: Request, res: Response) {
    const paramId = req.params.id;

    try {
        const uniqueUser = await prisma.user.findUnique({
            where: {
                id: paramId,
            },
            include: {
                car: true, // Inclure les informations sur la voiture liée à l'utilisateur
            },
        });

        if (!uniqueUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json({ uniqueUser: uniqueUser });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred while fetching user data" });
    }
},


  async makeTokenForUser(_id: string, email: string, tokenSecret: string) {
    return jwt.sign({ _id, email }, tokenSecret, {
      expiresIn: " 100000000 ", // in Milliseconds (3600000 = 1 hour)
    });
  },

  async getUserByToken  (req: Request, res: Response)  {
    let token = req.body.token;
  
    try {
      token = jwt.verify(token, config.token_secret);
    } catch (e) {
      return res.sendStatus(404);
    }
  
    const user = await prisma.user.findUnique({ where: { email: token.email } });
  
    res.send({ token, user });
  },

  async sendConfirmationEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });
  
      if (user) {
        // Création du token
        const token = makeTokenForUser(user.id, user.email);
        // Assurez-vous que makeTokenForUser est correctement implémenté
  
        // Envoi de l'e-mail de confirmation
        await doSendConfirmationEmail(email, token);
        // Assurez-vous que doSendConfirmationEmail est correctement implémenté
  
        res.status(200).send({
          message: "L'e-mail de confirmation a été envoyé à " + email,
        });
      } else {
        res.status(404).send({ message: "Utilisateur inexistant" });
      }
    } catch (error) {
      res.status(500).send({ message: "Une erreur s'est produite lors de l'envoi de l'e-mail de confirmation" });
    }
  },
  
  async forgotPassword(req: Request, res: Response): Promise<void> {
    const codeDeReinit = req.body.codeDeReinit;
    const user: User | null = await prisma.user.findUnique({ where: { email: req.body.email } });
  
    if (user) {
      try {
        // Création du token
        const token = jwt.sign(
          { _id: user.id, email: user.email },
          config.token_secret,
          {
            expiresIn: '1h', // 1 heure
          }
        );
  
        await envoyerEmailReinitialisation (req.body.email, codeDeReinit);
  
        res.status(200).send({
          message: `L'e-mail de réinitialisation a été envoyé à ${user.email}`,
        });
      } catch (error) {
        console.error("Erreur lors de l'envoi de l'e-mail de réinitialisation :", error);
        res.status(500).send({ message: "Erreur lors de l'envoi de l'e-mail de réinitialisation" });
      }
    } else {
      res.status(404).send({ message: 'Utilisateur inexistant' });
    }
  },
  
  async updateUser( req: Request, res: Response) {
    try {
      const paramId = req.params.id;
      const {Fname, Lname, phone_number, email, password, role , status } = req.body; 
      const existingUser = await prisma.user.findUnique({
        where: { id: paramId },
      });
      if (!existingUser) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
      const updateUser = await prisma.user.update({
        where: { id: paramId },
        data: {
          Fname,
          Lname,
          phone_number,
          email,
          password,
          role,
          status,
        },
      });
      return res.json({ updateUser });
    } catch (error) {
      console.log(error)
      console.error('Erreur lors de la mise à jour de l\'utilisateur', error);
      return res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'utilisateur' });
    }

  },

  async editProfilePicture(req: Request, res: Response, next: NextFunction){
    try {
      const file = req.file as Express.Multer.File; // Type assertion to ensure req.file is not undefined
      const userId = req.params.userId;
  
      const editProfilePicture = await prisma.user.update({
        where: { id: userId },
        data: {
          profilePicture: file.filename,
        },
      });
  
      res.send({ editProfilePicture });
    } catch (error) {
      next(error);
    } finally {
      await prisma.$disconnect();
    }
  },

  async deletUser(req: Request, res: Response){
    const paramId = req.params.id;

    const deletedUser = await prisma.user.delete({
        where: {
            id : paramId,
        },
    });
  
    return res.json({deletedUser: deletedUser});
  },

  async deleteAll (req: Request, res: Response)  {
    try {
      await prisma.user.deleteMany();
      return res.status(204).send({ message: 'Aucun élément' });
    } catch (error) {
      console.error('Une erreur s\'est produite :', error);
      return res.status(500).send({ message: 'Une erreur s\'est produite' });
    }
  },
  async showloginPage  (req: Request, res: Response)  {
    res.render('auth/signIn');
  },
  
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({
        where: {
          email: email
        }
      });
  
      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign({ email: email }, tokenSecret, { expiresIn: '36000000' });
  
        if (user.isVerified) {
          const userCo = user;
          const users = await prisma.user.count();
  
          res.render("layout", {
            userCo,
            users
          });
  
          res.status(200).send({ token, user, message: 'Success' });
        } else {
          res.status(200).send({ user, message: 'Email non vérifié' });
        }
      } else {
        res.status(403).send({ message: 'Mot de passe ou email incorrect' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Une erreur s'est produite lors de la connexion" });
    }
  },
  

  async loginWithSocial(req: Request, res: Response): Promise<void> {
    const { email, firstName, lastName } = req.body;
  
    if (email === '') {
      res.status(403).send({ message: 'Erreur, veuillez fournir une adresse e-mail' });
    } else {
      let user: User | null = await prisma.user.findUnique({ where: { email } });
  
      if (user) {
        console.log('Utilisateur existant, connexion en cours');
      } else {
        console.log('Utilisateur inexistant, création d\'un compte');
  
        user = await prisma.user.create({
          data: {
            email,
            Fname: firstName,
            Lname: lastName,
            phone_number: '', // Ajoutez le champ phoneNumber
            password: '', // Ajoutez le champ password
            role: Role.User ,// Définissez le rôle de l'utilisateur, par exemple Role.User
            isVerified: true, // Définissez la vérification de l'utilisateur, par exemple à true ou false selon vos besoins
          },
        });
      }
      // Création du jeton (token)
      const token = jwt.sign({ email }, config.token_secret, {
        expiresIn: '360000000',
      });
  
      res.status(201).send({ message: 'Succès', user, token });
    }
  }
  
};

const config = {
  token_secret: 'your_token_secret',
  // Autres propriétés de configuration
};

const makeTokenForUser = (_id: string, email: string): string => {
  const token = jwt.sign({ _id, email }, config.token_secret, {
    expiresIn: "100000000", // en millisecondes (3600000 = 1 heure)
  });

  return token;
};
async function doSendConfirmationEmail(email: string, token: string): Promise<void> {
  try {
    sgMail.setApiKey('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');

    const urlDeConfirmation = "http://localhost:3333/api/user/confirmation/" + token;
    const msg = {
      to: email,
      from: 'application.roadtrip.app@gmail.com',
      subject: 'Confirmation de votre email',
      html: `<h3>Veuillez confirmer votre email en utilisant ce lien :</h3><a href="${urlDeConfirmation}">Confirmation</a>`,
    };

    await sgMail.send(msg);
    console.log("Email envoyé à " + email);
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'e-mail de confirmation :", error);
  }
}
async function envoyerEmailReinitialisation(email: string, codeDeReinit: string): Promise<void> {
  
  sgMail.setApiKey('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');
  const msg = {
    to: email,
    from: 'application.roadtrip.app@gmail.com',
    subject: 'Réinitialisation de votre mot de passe',
    html: `<h3>Voici votre code de réinitialisation :</h3><p>${codeDeReinit}</p>`,
  };

  await sgMail.send(msg);
}


 







