import express from 'express';
import { userController } from '../controllers/user.controller';
import { upload } from '../middlewares/storage';
import app from '../app';
import bodyParser from 'body-parser';

const router = express.Router();

router.get("/", userController.index)
//router.get("/update", userController.showUpdateUserPage);

router.get("/{id}", userController.index)

router.put("/users/update/:id", bodyParser.json(), userController.showUpdateUserPage);
//app.put('/users/:id', userController.updateUser);
router.get("/create", userController.showCreateUserPage);
router.put("/:id", userController.updateUser);
//router.get("/update", userController.showUpdateUserPage);
router.delete("/:id", userController.deletUser);
router.post("/create", userController.createUser);
router.delete("/:id", userController.deletUser);
router.get("/:id", userController.findUniqueUser);
router.get('/update/:id', userController.showUpdateUserPage);
router.post("/send-confirmation-email", userController.sendConfirmationEmail);
//router.post("/login", userController.login);
router.get("/login", userController.showloginPage);
//router.get("/:id", userController.findUniqueUser); 



export default router;
