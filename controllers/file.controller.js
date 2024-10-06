const { upload, deleteFile } = require("../services/file.services")
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

/**
 * @description A method to handle deleting a file
 * @param req - The request object representing the HTTP request
 * @param res - The response object representing the HTTP response
 * @returns {*}
 */
exports.deleteFile = exec(async (req, res) => {
  /**
   * @description Extracting the file name from the request parameters
   */
  const { file } = req.params

  /**
   * @description Calling the deleteFile service to handle the file deletion
   */
  const response = await deleteFile(file)

  /**
   * @description Returning a success response after successful deletion of the file
   */
  new SuccessResponse("File deleted successfully", response).send(res)
})
