import express from 'express';
import { eventController } from "../controllers/events.controller"
import { upload } from "../middlewares/storage";

const router = express.Router();

router.get("/", eventController.index );
router.post("/create", eventController.createEvent);
router.get("/:id", eventController.findUniqueEvent);
router.put("/:id", eventController.updateEvent);
router.put("/edit-event-picture/:eventId", upload.single('eventPicture'), eventController.editEventPicture);
router.delete("/:id", eventController.deletEvent);

export default router;