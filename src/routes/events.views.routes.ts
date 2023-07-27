import express from 'express';
import { eventController } from "../controllers/events.controller"
import { upload } from "../middlewares/storage";

import bodyParser from 'body-parser';

const router = express.Router();

router.get("/", eventController.index );
router.post("/create", eventController.createEvent);
//router.put("/events/update/:id", bodyParser.json(), eventController.showUpdateEventPage);
router.get('/update/:id', eventController.showUpdateEventPage);
//router.get("/:id", eventController.findUniqueEvent); kaaed yakra f hedhi mech fehm aaleh
//router.put("/:id", eventController.updateEvent);
router.put("/:id", bodyParser.json(), eventController.updateEvent);
router.get("/update",eventController.showUpdateEventPage);
router.get("/create", eventController.showCreateEventPage);
router.put("/edit-event-picture/:eventId", upload.single('eventPicture'), eventController.editEventPicture);
router.delete("/:id", eventController.deletEvent);

export default router;