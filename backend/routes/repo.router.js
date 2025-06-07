const express = require("express");
const repoController = require("../controllers/repoController.js");
const authMiddleware = require("../middleware/authMiddleware.js");
const repoRouter = express.Router();

// Public routes
repoRouter.get("/repo/all", repoController.getAllRepository);
repoRouter.get("/repo/:id", repoController.fetchRepositoryById);
repoRouter.get("/repo/name/:name", repoController.fetchRepositoryByName);

// Protected routes
repoRouter.post("/repo/create", authMiddleware, repoController.createRepository);
repoRouter.get("/repo/user/:userID", authMiddleware, repoController.fetchRepositoryForCurrentUser);
repoRouter.put("/repo/update/:id", authMiddleware, repoController.updateRepositoryById);
repoRouter.delete("/repo/delete/:id", authMiddleware, repoController.deleteRepositoryById);
repoRouter.patch("/repo/toggle/:id", authMiddleware, repoController.toggleVisibiltiyById);

module.exports = repoRouter;