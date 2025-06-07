const express = require("express");
const issueController = require("../controllers/issueController.js");
const authMiddleware = require("../middleware/authMiddleware.js");
const issueRouter = express.Router();

// Public routes
issueRouter.get("/issue/all", issueController.getAllIssues);
issueRouter.get("/issue/:id", issueController.getIssueById);

// Protected routes
issueRouter.post("/issue/create", authMiddleware, issueController.createIssue);
issueRouter.put("/issue/update/:id", authMiddleware, issueController.updateIssueById);
issueRouter.delete("/issue/delete/:id", authMiddleware, issueController.deleteIssueById);

module.exports = issueRouter;