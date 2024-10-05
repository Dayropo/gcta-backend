const Post = require("../models/Post")
const User = require("../models/User")
const {
  AuthFailureError,
  InternalError,
  DuplicateDataError,
} = require("../utilities/core/ApiError")
const jwt = require("jsonwebtoken")

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

async function getAllPosts() {
  const posts = await Post.find().populate("author", "name").sort({ publishedAt: -1 })

  if (!posts)
    throw new InternalError("An error occurred while fetching posts. Please try again later!")

  return posts
}

module.exports = {
  createPost,
  getAllPosts,
  // getPostById,
}
