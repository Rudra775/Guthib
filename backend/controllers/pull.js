const fs = require("fs").promises;
const path = require("path");
const { s3, S3_BUCKET } = require("../config/aws-config.js");
const {
  ListObjectsV2Command,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { pipeline } = require("stream");
const { promisify } = require("util");
const streamPipeline = promisify(pipeline);

async function pullRepo() {
  const repoPath = path.resolve(process.cwd(), ".privHub");
  const commitsPath = path.join(repoPath, "commits");

  try {
    const data = await s3.send(
      new ListObjectsV2Command({
        Bucket: S3_BUCKET,
        Prefix: "commits/",
      })
    );

    const objects = data.Contents;

    if (!objects || objects.length === 0) {
      console.log("No commits found in S3.");
      return;
    }

    for (const object of objects) {
      const key = object.Key;
      const relativePath = path.relative("commits", key); // remove the prefix
      const commitDir = path.join(commitsPath, path.dirname(relativePath));

      await fs.mkdir(commitDir, { recursive: true });

      const getObjectCommand = new GetObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
      });

      const response = await s3.send(getObjectCommand);
      const filePath = path.join(commitsPath, relativePath);
      const writeStream = (await fs.open(filePath, "w")).createWriteStream();

      await streamPipeline(response.Body, writeStream);
    }

    console.log("All commits pulled from S3");
  } catch (err) {
    console.error("Unable to pull from commits:", err);
  }
}

module.exports = { pullRepo };
