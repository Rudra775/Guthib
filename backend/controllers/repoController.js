const mongoose = require("mongoose");
const Repository = require("../models/repoModel.js");
const User = require("../models/userModel.js");
const Issue = require("../models/issueModel.js");

const createRepository = async (req, res) => {
    const { owner, name, issues, content, visibility, description } = req.body;

    try {
        if (!name) {
            return res.status(400).json({ error: "Repository name is required" });
        }

        if (!mongoose.Types.ObjectId.isValid(owner)) {
            return res.status(400).json({ error: "Invalid owner ID" });
        }

        const newRepository = new Repository({
            owner,
            name,
            issues,
            content,
            visibility,
            description
        });

        const result = await newRepository.save();

        res.status(201).json({
            message: "Repository created",
            repositoryId: result._id
        });

    } catch (err) {
        console.error("Error while creating repo:", err.message);
        res.status(500).json({ message: "Server error" });
    }
}


const getAllRepository = async (req, res) => {
    try {
        const repositories = await Repository.find({})
        .populate("owner")
        .populate("issues");

        
    } catch (err) {
        console.log("Error while fetching repositories : ", err.message);
        res.status(500).json({message : "Server error"});
        
    }   
}

const fetchRepositoryById = async (req, res) => {
    const {id} = req.params; 

    try {
        const repository = await Repository.find({
            _id: id
        })
        .populate("owner")
        .populate("issues").atArray();

        res.json(repository);
    }
    catch (err) {
        console.log("Error while fetching repository : ", err.message);
        res.status(500).json({message : "Server error"});
        
    }
}

const fetchRepositoryByName = async (req, res) => {
    const {name} = req.params; 

    try {
        const repository = await Repository.find({
            name: name
        })
        .populate("owner")
        .populate("issues")

        res.json(repository);
    }
    catch (err) {
        console.log("Error while fetching repository : ", err.message);
        res.status(500).json({message : "Server error"});   
    }
}

const fetchRepositoryForCurrentUser = async (req, res) => {
    const userId = req.user;

    try {
        const repositories = await Repository.find({owner: userId});
        if(!repositories || repositories.length == 0) {
            return res.status(404).json({error: "User Repositories not found"});
        }

        res.json({message: "Respositories found"}, repositories);
        
    } catch (err) {
         console.log("Error while fetching repository : ", err.message);
         res.status(500).json({message : "Server error"});   
    }
}

const updateRepositoryById = async (req, res) => {
    const {id} = req.params;
    const {content, description} = req.body;

    try {
        const repository = await Repository.findById(id);
        if(!repository) {
            return res.status(404).json({error: "Repository not found"})
        }

        repository.content.push(content);
        repository.description = description;

        const updatedRepository = await repository.save();

        res.json({
            message: "Repository updated successfully",
            repository: updatedRepository
        })

    }

    catch (err) {
         console.log("Error while fetching repository : ", err.message);
         res.status(500).json({message : "Server error"});   
    }

}

const toggleVisibiltiyById = async (req, res) => {
    const {id} = req.params;
    const {content, description} = req.body;

    try {
        const repository = await Repository.findById(id);
        if(!repository) {
            return res.status(404).json({error: "Repository not found"})
        }

        repository.visibility = !repository.visibility;
        
        const updatedRepository = await repository.save();

        res.json({
            message: "Repository updated successfully",
            repository: updatedRepository
        })

    }

    catch (err) {
         console.log("Error while fetching repository : ", err.message);
         res.status(500).json({message : "Server error"});   
    }
}

const deleteRepositoryById = async (req, res) => {
    
    const {id} = req.params;

    try{
        const repository = await Repository.findByIdAndDelete(id);

        if(!repository) {
            return res.status(404).json({error: "Repository not found"})
        }
    res.json({message: "Repository deleted successfully"})
    }
    
    catch (err) {
         console.log("Error while deleting repository : ", err.message);
         res.status(500).json({message : "Server error"});   
    }
}

module.exports = {
    createRepository,
    getAllRepository,
    fetchRepositoryById,
    fetchRepositoryByName,
    fetchRepositoryForCurrentUser,
    updateRepositoryById,
    toggleVisibiltiyById,
    deleteRepositoryById
}