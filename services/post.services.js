const Post = require("../models/Post")
const User = require("../models/User")
const {
  AuthFailureError,
  InternalError,
  DuplicateDataError,
} = require("../utilities/core/ApiError")
const jwt = require("jsonwebtoken")
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3")
const dotenv = require("dotenv")
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")

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

async function createPost(data, cookie) {
  const claims = jwt.verify(cookie, process.env.JWT_SECRET)

  if (!claims) throw new AuthFailureError("Invalid token!")

  const user = await User.findOne({ _id: claims._id })
  const { _id } = await user.toJSON()

  const checkPost = await Post.findOne({ title: data.title })
  if (checkPost) throw new DuplicateDataError("A post with this title already exists!")

  let post = new Post({
    ...data,
    author: _id,
  })
  const result = await post.save()

  if (result) {
    return result.toJSON()
  } else {
    throw new InternalError("An error occurred while creating a post. Please try again later!")
  }
}

async function getAllPosts(author) {
  if (author && author !== "all") {
    const posts = await Post.find({ author }).populate("author", "name").sort({ publishedAt: -1 })

    if (!posts)
      throw new InternalError("An error occurred while fetching posts. Please try again later!")

    for (const post of posts) {
      const getObjectParams = {
        Bucket: bucketName,
        Key: post.mainImage,
      }

      const command = new GetObjectCommand(getObjectParams)
      const url = await getSignedUrl(s3, command, { expiresIn: 3600 })
      post.imageUrl = url
    }

    return posts
  } else {
    const posts = await Post.find().populate("author", "name").sort({ publishedAt: -1 })

    if (!posts)
      throw new InternalError("An error occurred while fetching posts. Please try again later!")

    for (const post of posts) {
      const getObjectParams = {
        Bucket: bucketName,
        Key: post.mainImage,
      }

      const command = new GetObjectCommand(getObjectParams)
      const url = await getSignedUrl(s3, command, { expiresIn: 3600 })
      post.imageUrl = url
    }

    return posts
  }
}

async function getPostBySlug(slug) {
  const post = await Post.findOne({ slug }).populate("author", "name")

  if (!post)
    throw new InternalError("An error occurred while fetching post. Please try again later!")

  const getObjectParams = {
    Bucket: bucketName,
    Key: post.mainImage,
  }

  const command = new GetObjectCommand(getObjectParams)
  const url = await getSignedUrl(s3, command, { expiresIn: 3600 })
  post.imageUrl = url

  return post
}

async function updatePost(data, slug, cookie) {
  const claims = jwt.verify(cookie, process.env.JWT_SECRET)

  if (!claims) throw new AuthFailureError("Invalid token!")

  const user = await User.findOne({ _id: claims._id })
  const { _id } = await user.toJSON()

  const post = await Post.findOne({ slug })

  if (!post) throw new InternalError("Post not found!")

  if (post.author.toString() !== _id.toString())
    throw new AuthFailureError("You are not authorized to update this post!")

  const updatedPost = await Post.findOneAndUpdate({ slug }, { ...data }, { new: true })

  if (!updatedPost) throw new InternalError("An error occurred while updating the post!")

  return updatedPost
}

async function deletePost(slug, cookie) {
  const claims = jwt.verify(cookie, process.env.JWT_SECRET)

  if (!claims) throw new AuthFailureError("Invalid token!")

  const user = await User.findOne({ _id: claims._id })
  const { _id } = await user.toJSON()

  const post = await Post.findOne({ slug })

  if (!post) throw new InternalError("Post not found!")

  if (post.author.toString() !== _id.toString())
    throw new AuthFailureError("You are not authorized to delete this post!")

  const deletedPost = await Post.findOneAndDelete({ slug })

  if (!deletedPost) throw new InternalError("An error occurred while deleting the post!")

  return deletedPost
}

module.exports = {
  createPost,
  getAllPosts,
  getPostBySlug,
  updatePost,
  deletePost,
}
