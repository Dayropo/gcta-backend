const express = require("express")
const mongoose = require("mongoose")
const morgan = require("morgan")
const bodyParser = require("body-parser")
const dotenv = require("dotenv")
const cors = require("cors")
const HPP = require("hpp")

const { NotFoundError, ApiError, InternalError } = require("./utilities/core/ApiError")

dotenv.config()

const routeHandler = require("./routes")

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const db = mongoose.connection

db.on("error", err => {
  console.log(err)
})

db.once("open", () => {
  console.log("Database Connection Established!")
})

const app = express()

app.use(
  cors({
    origin: ["http://localhost:3000", "https://gcta-frontend.vercel.app"],
    credentials: true,
  })
)
app.use(HPP())
app.use(morgan("dev"))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use("/v1", routeHandler)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(new NotFoundError("Resource Not Found"))
})

// error handler
app.use(function (err, req, res, next) {
  // Checks if err is thrown by us and handled to the ApiError Class, if not we throw and handle an internal server error
  if (err instanceof ApiError) {
    ApiError.handle(err, res)
  } else {
    ApiError.handle(new InternalError(err), res)
  }
  // log error to the console for debugging purpose
  // config.logger.error(`${err} app----`)
  console.error(err)
})

const PORT = process.env.PORT || 3030
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
