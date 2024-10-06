const User = require("../models/User")
const {
  DuplicateDataError,
  InternalError,
  AuthFailureError,
} = require("../utilities/core/ApiError")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")

dotenv.config()

async function register(data) {
  const checkUser = await User.findOne({
    email: data.email,
  })

  if (checkUser)
    throw new DuplicateDataError(
      "User's email already exists. Proceed to login or create an account with a new email address"
    )

  const salt = await bcrypt.genSalt()
  const hashPassword = await bcrypt.hash(data.password, salt)

  let user = new User({
    ...data,
    password: hashPassword,
  })
  const result = await user.save()

  if (result) {
    const { password, ...data } = await result.toJSON()

    return data
  } else {
    throw new InternalError(
      "An error occurred while creating your account. Please try again later!"
    )
  }
}

async function login(data) {
  const user = await User.findOne({
    email: data.email,
  })

  if (!user) throw new AuthFailureError("User does not exist!")

  const validPassword = await bcrypt.compare(data.password, user.password)

  if (!validPassword) throw new AuthFailureError("Invalid login credentials!")

  const token = jwt.sign(
    {
      _id: user._id,
    },
    process.env.JWT_SECRET
  )

  return { token }
}

async function getUser(cookie) {
  const claims = jwt.verify(cookie, process.env.JWT_SECRET)

  if (!claims) throw new AuthFailureError("Invalid token")

  const user = await User.findOne({ _id: claims._id })
  const { password, ...data } = await user.toJSON()

  return data
}

async function getUsers() {
  const users = await User.find().select("-password")
  return users
}

module.exports = {
  register,
  login,
  getUser,
  getUsers,
}
