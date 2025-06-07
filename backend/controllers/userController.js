const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {MongoClient, ReturnDocument} = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();
const uri = process.env.MONGO_URI;
var ObjectId = require("mongodb").ObjectId;
let client;

async function connectClient() {
    if (!client) {
        client = new MongoClient(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        await client.connect();
    }
}

const getAllUsers = async (req, res) => {
    try {
        await connectClient();
        const db = client.db("guthib");
        const usersCollection = db.collection("users");

        const users = await usersCollection.find({}).toArray();
        res.json(users);


    } catch(err){
        console.log("Error during fetching", err);
        res.status(500).json({message: "Server error"});
    }
};

const signup = async (req, res) => {
    const { username, password, email } = req.body;

    try {
        await connectClient(); // Ensure the DB client is connected

        const db = client.db("guthib");
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({ username });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            username,
            password: hashedPassword,
            email,
            repositories: [],
            followedUsers: [],
            starRepos: [],
        };

        const result = await usersCollection.insertOne(newUser);

        // Use result.insertedId instead of insertId
        const token = jwt.sign(
            { id: result.insertedId },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1h" } // Use a valid expiry string like "1h", "7d", etc.
        );

        res.json({ token, userId : result.insertedId });
    } catch (err) {
        console.error("Error during signup:", err.message);
        res.status(500).send("Server Error");
    }
};

const login = async (req, res) => {
    const {email, password} = req.body;
    try{
        await connectClient();
        const db = client.db("guthib");
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({message: "Password invalid"});
        }

        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET_KEY, {expiresIn: "1h"});

        res.json({token, userId: user._id});

    } catch(err) {
        console.log("Error during login", err.message);
        res.status(500).send("Server error!");
    }
}

const getUserProfile = async (req, res) => {
    const userId = req.params.id;

    try{
        await connectClient();
        const db = client.db("guthib");
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({
            _id: new ObjectId(userId)
        })

        if(!user) {
            res.status(400).json({message: "User not found"});
        }

        res.status(200).send("Profile fetched");

    }catch(err) {
        res.status(500).send("server error");
    }
}

const updateUserProfile = async (req, res) => {
    const {email, password} = req.body;
    const userId = req.params.id;

    try{
        await connectClient();
        const db = client.db("guthib");
        const usersCollection = db.collection("users");

        let updateFields = {email}; 
        if(password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = bcrypt.hash(password, salt);
            updateFields.password = hashedPassword;
        }
        const result = await usersCollection.findOneAndUpdate(
            {
            _id: new ObjectId(userId),
            },
            {
                $set: updateFields
            },
            {ReturnDocument: "after"}
        )
        if(!result.value) {
            return res.status(404).json({message: "User not found"});
        }

        res.send(result.value);

    }catch(err) {
        console.log("Error during updating : ", err.message);
        res.status(500).send("Server error");
    }   
}

const deleteProfile = async (req, res) => {
    const userId = req.params.id;

    try{
        await connectClient();
        const db = client.db("guthib");
        const usersCollection = db.collection("users");

        const result = await usersCollection.deleteOne({
            _id: new ObjectId(userId)
        })

        if(result.deleCount==0) {
            return res.status(400).json({message: "User not found"});
        }

        res.json({message: "User Profile deleted"});

    }
    catch(err) {
        console.log("Error during updating : ", err.message);
        res.status(500).send("Server error");
    }
}

module.exports = {
    getAllUsers,
    signup,
    login,
    getUserProfile,
    updateUserProfile,
    deleteProfile,
};

