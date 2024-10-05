const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3")
const { InternalError } = require("../utilities/core/ApiError")
const dotenv = require("dotenv")

dotenv.config()

const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.ACCESS_KEY
const secretAccessKey = process.env.SECRET_ACCESS_KEY

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion,
})

async function upload(file) {
  const uniqueName = `DSC-${Date.now()}`

  const putObjectParams = {
    Bucket: bucketName,
    Key: uniqueName,
    Body: file.buffer,
    ContentType: file.mimetype,
  }

  const putCommand = new PutObjectCommand(putObjectParams)

  const putResponse = await s3.send(putCommand)

  if (putResponse) {
    const getObjectParams = {
      Bucket: bucketName,
      Key: uniqueName,
    }

    const getCommand = new GetObjectCommand(getObjectParams)
    const url = await getSignedUrl(s3, getCommand, { expiresIn: 3600 })

    return {
      filename: uniqueName,
      url: url,
    }
  } else {
    console.error("-------FILE UPLOAD ERROR-------")
    throw new InternalError("An error occurred. Please try again later!")
  }
}

module.exports = {
  upload,
}
