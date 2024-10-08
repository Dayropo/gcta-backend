const { register, login, getUser, getUsers } = require("../services/user.services")
const { CreatedResponse, SuccessResponse } = require("../utilities/core/ApiResponse")
const exec = require("../utilities/core/catchAsync")
const dotenv = require("dotenv")

dotenv.config()

/**
 * @description A method to handle registering a user
 * @param req - The request object representing the HTTP request
 * @param res - The response object representing the HTTP response
 * @returns {*}
 */
exports.register = exec(async (req, res) => {
  /**
   * @description Extracting the data from the request body
   */
  const data = req.body

  /**
   * @description Calling the register service to handle the registration process
   */
  const response = await register(data)

  /**
   * @description Returning a success response with the registered user data
   */
  new CreatedResponse("User registered successfully", response).send(res)
})

/**
 * @description A method to handle logging in a user
 * @param req - The request object representing the HTTP request
 * @param res - The response object representing the HTTP response
 * @returns {*}
 */
exports.login = exec(async (req, res) => {
  /**
   * @description Extracting the data from the request body
   */
  const data = req.body

  /**
   * @description Calling the login service to handle the login process
   */
  const response = await login(data)

  /**
   * @description Setting the JWT token as a cookie in the response
   */
  res.cookie("jwt", response.token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: process.env.APP_ENV !== "local" ? "none" : "lax",
    secure: process.env.APP_ENV !== "local" ? true : false,
  })

  /**
   * @description Returning a success response with the registered user data
   */
  new SuccessResponse("User logged in successfully").send(res)
})

/**
 * @description A method to handle getting a user
 * @param req - The request object representing the HTTP request
 * @param res - The response object representing the HTTP response
 * @returns {*}
 */
exports.getUser = exec(async (req, res) => {
  /**
   * @description Extracting the data from the request body
   */
  const cookie = req.cookies.jwt

  const response = await getUser(cookie)

  /**
   * @description Returning a success response with the registered user data
   */
  new SuccessResponse("User fetched successfully", response).send(res)
})

/**
 * @description A method to handle logging out a user
 * @param req - The request object representing the HTTP request
 * @param res - The response object representing the HTTP response
 * @returns {*}
 */
exports.logout = exec(async (req, res) => {
  /**
   * @description Clearing the JWT cookie
   */
  res.clearCookie("jwt")

  /**
   * @description Returning a success response with the registered user data
   */
  new SuccessResponse("User logged out successfully").send(res)
})

/**
 * @description A method to handle getting all users
 * @param req - The request object representing the HTTP request
 * @param res - The response object representing the HTTP response
 * @returns {*}
 */
exports.getUsers = exec(async (req, res) => {
  /**
   * @description Calling the getUsers service to handle the post creation process
   */
  const response = await getUsers()

  /**
   * @description Returning a success response with the created post data
   */
  new SuccessResponse("Users fetched successfully", response).send(res)
})
