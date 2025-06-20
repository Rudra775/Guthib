const fs = require("fs").promises;
const path = require("path");

async function initRepo() {
    const repoPath = path.resolve(process.cwd(), ".privHub");
    const commitsPath = path.join(repoPath, "commits");

    try {
        await fs.mkdir(repoPath, {recursive: true});
        await fs.mkdir(commitsPath, {recursive: true});
        await fs.writeFile(
            path.join(repoPath, "config.json"),
            JSON.stringify({bucket: process.env.S3_BUCKET})
        )
        console.log("Repository Initialised");
    } catch (error) {
        console.log("Error initialising repository");
    }
    
}

module.exports = {initRepo}