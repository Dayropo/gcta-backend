const { createPost, getAllPosts } = require("../services/post.services")
const { CreatedResponse, SuccessResponse } = require("../utilities/core/ApiResponse")
const exec = require("../utilities/core/catchAsync")

/**
 * @description A method to handle creating a post
 * @param req - The request object representing the HTTP request
 * @param res - The response object representing the HTTP response
 * @returns {*}
 */
exports.createPost = exec(async (req, res) => {
  /**
   * @description Extracting the data from the request body
   */
  const data = req.body
  const cookie = req.cookies.jwt

  /**
   * @description Calling the createPost service to handle the post creation process
   */
  const response = await createPost(data, cookie)

  /**
   * @description Returning a success response with the created post data
   */
  new CreatedResponse("Post created successfully", response).send(res)
})

/**
 * @description A method to handle getting all posts
 * @param req - The request object representing the HTTP request
 * @param res - The response object representing the HTTP response
 * @returns {*}
 */
exports.getAllPosts = exec(async (req, res) => {
  /**
   * @description Calling the getAllPosts service to handle the post creation process
   */
  const response = await getAllPosts()

  /**
   * @description Returning a success response with the created post data
   */
  new SuccessResponse("Posts fetched successfully", response).send(res)
})
