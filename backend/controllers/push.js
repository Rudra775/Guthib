const fs = require("fs").promises;
const path = require("path");
const { s3, S3_BUCKET } = require("../config/aws-config.js");
const { Upload } = require("@aws-sdk/lib-storage");

async function pushRepo () {
    const repoPath = path.resolve(process.cwd(), ".privHub");
    const commitsPath = path.join(repoPath, "commits");

    try {
        const commitDirs = await fs.readdir(commitsPath);
        for (const commitDir of commitDirs) {
            const commitPath = path.join(commitsPath, commitDir);
            const files = await fs.readdir(commitPath);

            for (const file of files) {
                const filePath = path.join(commitPath, file);
                const fileContent = await fs.readFile(filePath);

                const upload = new Upload({
                    client: s3,
                    params: {
                        Bucket: S3_BUCKET,
                        Key: `commits/${commitDir}/${file}`,
                        Body: fileContent,
                    },
                });

                await upload.done();
            }
        }
        console.log("All commits pushed to S3");
    } catch (err) {
        console.error("Error occurred pushing to S3: ", err);
    }
}

module.exports = { pushRepo };
