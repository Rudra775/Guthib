const express = require("express");
const userController = require("../controllers/userController.js");
const userRouter = express.Router();
const authMiddleware = require("../middleware/authMiddleware.js");


userRouter.get("/allUsers", userController.getAllUsers);
userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);

userRouter.get("/userProfile/:id",authMiddleware, userController.getUserProfile);
userRouter.put("/updateProfile/:id",authMiddleware, userController.updateUserProfile);
userRouter.delete("/deleteProfile/:id", authMiddleware, userController.deleteProfile);

module.exports = userRouter;