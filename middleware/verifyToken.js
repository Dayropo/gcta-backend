const jwt = require("jsonwebtoken")
const { AuthFailureError } = require("../utilities/core/ApiError")

const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        console.error(err.message)
        throw new AuthFailureError("Invalid token")
      } else {
        next()
      }
    })
  } else {
    throw new AuthFailureError("No token provided")
  }
}

module.exports = {
  verifyToken,
}
