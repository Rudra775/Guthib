require("dotenv").config(); // Load .env

const { S3Client } = require("@aws-sdk/client-s3");

const S3_BUCKET = "rudraaasamplebucket"; // Replace with your actual S3 bucket

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

module.exports = { s3, S3_BUCKET };
