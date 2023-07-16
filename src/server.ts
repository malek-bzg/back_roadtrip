import express from "express";
import app from "./app";
import { userController } from "./controllers/user.controller";
import path from "path";

app.post("/api/users", userController.createUser);

const port = process.env.PORT || 3000;
app.use('/assets', express.static(path.join('../assets')));

app.listen(port, () => {

  console.log(`Server running on port ${port}`);
});
