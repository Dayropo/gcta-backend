const { upload } = require("../services/file.services")
const { SuccessResponse } = require("../utilities/core/ApiResponse")
const exec = require("../utilities/core/catchAsync")

/**
 * @description A method to handle uploading a file
 * @param req - The request object representing the HTTP request
 * @param res - The response object representing the HTTP response
 * @returns {*}
 */
exports.upload = exec(async (req, res) => {
  /**
   * @description Extracting the data and file from the request object
   */
  const file = req.file

  /**
   * @description Calling the upload service to handle the file upload
   */
  const response = await upload(file)

  /**
   * @description Returning a success response with the uploaded file data
   */
  new SuccessResponse("File uploaded successfully", response).send(res)
})
