import express from 'express';
import { userController } from '../controllers/user.controller';
import { upload } from '../middlewares/storage';

const router = express.Router();

router.get("/", userController.index)
//router.get("/{id}", userController.index)
router.put("/:id", userController.updateUser);
router.get("/update", userController.showUpdateUserPage);
router.delete("/:id", userController.deletUser);
router.post("/create", userController.createUser);
router.delete("/:id", userController.deletUser);
router.get("/create", userController.showCreateUserPage);
router.post("/login", userController.login);
router.get("/login", userController.showloginPage);
router.get("/:id", userController.findUniqueUser);



// Ajoutez d'autres routes pour les utilisateurs si nécessaire

export default router;
