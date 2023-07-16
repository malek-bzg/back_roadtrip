import express from 'express';
import { userController } from '../controllers/user.controller';
import { upload } from '../middlewares/storage';

const router = express.Router();


router.get("/", userController.index);
router.post("/get-by-token", userController.getUserByToken);
router.post('/users', userController.createUser);
router.get("/:id", userController.findUniqueUser);
router.post("/send-confirmation-email", userController.sendConfirmationEmail);
router.post("/login-with-social", userController.loginWithSocial);
router.post("/forgot-password", userController.forgotPassword);
router.post("/confirmation", userController.confirmation);
router.delete("/:id", userController.deletUser);
router.post("/login", userController.login);
router.put("/:id", userController.updateUser);
router.put("/edit-profile-picture/:userId", upload.single('profilePicture'), userController.editProfilePicture);
router.delete("/all", userController.deleteAll);


// Ajoutez d'autres routes pour les utilisateurs si nécessaire

export default router;
