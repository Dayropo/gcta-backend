/**
 * @enum an object that's holds all possible API status code. The object.freeze method is called to prevent addition of properties
 * later in the code. This emulates the ENUM type of other languages like JAVA
 */
// eslint-disable-next-line max-classes-per-file
const STATUS_CODE_ENUM = Object.freeze({
  SUCCESS: "1000",
  FAILURE: "1001",
  RETRY: "1002",
  INVALID_ACCESS_TOKEN: "1003",
  EXPIRED_ACCESS_TOKEN: "1004",
})

/**
 * @enum an object that's holds all possible API status response representing if a request was successful or not. The object.freeze
 * method is called to prevent addition of properties later in the code. This emulates the ENUM type of other languages like JAVA
 */
// eslint-disable-next-line max-classes-per-file
const STATUS_ENUM = Object.freeze({
  SUCCESS: "Successful",
  FAILURE: "Failed",
})

/**
 * @enum an object that's holds all possible API response status code. The object.freeze method is called to prevent addition of properties
 * later in the code. This emulates the ENUM type of other languages like JAVA
 */
const RESPONSE_CODE_ENUM = Object.freeze({
  SUCCESS: 200,
  CREATED: 201,
  ACCEPTED: 202,
  FOUND: 302,
  NOT_MODIFIED: 304,
  TEMP_REDIRECT: 307,
  PERMANENT_REDIRECT: 308,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  DUPLICATE_DATA: 409,
  INTERNAL_ERROR: 500,
})

/**
 * @class ApiResponse
 * @abstract this class cannot be instantiated
 * @classdesc An abstract base class that defines a uniformity for all API responses
 */
class ApiResponse {
  /**
   * @param statusCode - a status code from the STATUS_CODE_ENUM above
   * @param responseStatus -  a response code from the RESPONSE_CODE_ENUM above
   * @param message - a short string that gives a description about the responses
   * @param status - a string signifying the state of the response e.g successful or failed
   * @param details - used only for errors to show details about the error
   * @description since the class is abstract, this constructor must be called from the subclass using the super(...)
   */
  constructor(statusCode, responseStatus, message, details, status) {
    /**
     * since abstract classes cannot be created naturally in javascript, we induced it by throwing an
     * error when this class is instantiated directly and not subclassed
     * @see {@link https://stackoverflow.com/questions/29480569/does-ecmascript-6-have-a-convention-for-abstract-classes/30560792}
     */
    if (new.target === ApiResponse) {
      throw new TypeError("Cannot Construct Abstract Instance Directly")
    }

    // class fields or properties
    this.statusCode = statusCode
    this.responseStatus = responseStatus
    this.url = ""
    this.message = message
    this.details = details
    this.status = status

    // Response Headers
    this.contentType = "application/json"
    this.poweredBy = "EDGE-APP"
  }

  /**
   * @method setHeaders
   * @param res - response object from expressJs
   * @description - this method sets the required headers in the response before they are sent
   */
  setHeaders(res) {
    res.set("X-Powered-By", this.poweredBy)
    res.set("Content-Type", this.contentType)
  }

  /**
   * @method payload
   * @param data
   * @returns {{data: *, message: *, status: *}}
   * @description defines the payload structure
   */
  payload(data) {
    return {
      status: this.status,
      message: this.message,
      data,
    }
  }

  /**
   * @method prepare
   * @param res - response object from expressJs
   * @param data - payload object
   * @returns Json Payload Response
   * @description this prepares the responses by setting the headers first, adding the request URI and returning the response
   */
  prepare(res, data) {
    this.setHeaders(res)
    const slashes = "://"
    this.url = res.req.protocol + slashes + res.req.get("host") + res.req.originalUrl
    return res.status(this.responseStatus).json(this.payload(data))
  }

  /**
   * @method send
   * @param res - response object from expressJs
   * @returns Json Object
   * @description sends the response
   */
  send(res) {
    return this.prepare(res)
  }
}

/**
 * @class SuccessResponse
 * @classdesc this class should be used to return a success response with a payload, its subclasses the
 * abstract @see ApiResponse class and calls its constructor using the @see STATUS_CODE_ENUM, RESPONSE_CODE_ENUM and the message
 * to be displayed. The payload is passed as a second parameter its constructor
 */
class SuccessResponse extends ApiResponse {
  /**
   * @param message - message to be displayed
   * @param data - the payload
   */
  constructor(message, data) {
    super(STATUS_CODE_ENUM.SUCCESS, RESPONSE_CODE_ENUM.SUCCESS, message, null, STATUS_ENUM.SUCCESS)
    this.data = data
  }

  /**
   * @override its overrides the send method in the superclass
   * @param res res response object from expressJs
   * @returns Json Object
   * @description sends the response
   */
  send(res) {
    return super.prepare(res, this.data)
  }
}

/**
 * @class CreatedResponse
 * @classdesc this class should be used to return a created response with a payload, its subclasses the
 * abstract @see ApiResponse class and calls its constructor using the @see STATUS_CODE_ENUM, RESPONSE_CODE_ENUM and the message
 * to be displayed. The payload is passed as a second parameter to its constructor
 */
class CreatedResponse extends ApiResponse {
  /**
   * @param message message to be displayed
   * @param data the payload
   */
  constructor(message, data) {
    super(STATUS_CODE_ENUM.SUCCESS, RESPONSE_CODE_ENUM.CREATED, message, STATUS_ENUM.SUCCESS)
    this.data = data
  }

  /**
   * @override its overrides the send method in the superclass
   * @param res res response object from expressJs
   * @returns Json Object
   * @description sends the response
   */
  send(res) {
    return super.prepare(res, this.data)
  }
}

/**
 * @class AuthFailureResponse
 * @classdesc this class should be used to return an authentication failure response, its subclasses the
 * abstract @see ApiResponse class and calls its constructor using the @see STATUS_CODE_ENUM, RESPONSE_CODE_ENUM constants
 * and the message to be displayed.
 */
class AuthFailureResponse extends ApiResponse {
  constructor(message = "Authentication Failure", details) {
    super(
      STATUS_CODE_ENUM.FAILURE,
      RESPONSE_CODE_ENUM.UNAUTHORIZED,
      message,
      details,
      STATUS_ENUM.FAILURE
    )
  }
}

/**
 * @class ForbiddenResponse
 * @classdesc this class should be used to return a forbidden response, its subclasses the
 * abstract @see ApiResponse class and calls its constructor using the @see STATUS_CODE_ENUM, RESPONSE_CODE_ENUM constants
 * and the message to be displayed.
 */
class ForbiddenResponse extends ApiResponse {
  constructor(message = "Forbidden", details) {
    super(
      STATUS_CODE_ENUM.FAILURE,
      RESPONSE_CODE_ENUM.FORBIDDEN,
      message,
      details,
      STATUS_ENUM.FAILURE
    )
  }
}

/**
 * @class BadRequestResponse
 * @classdesc this class should be used to return a bad request response, its subclasses the
 * abstract @see ApiResponse class and calls its constructor using the @see STATUS_CODE_ENUM, RESPONSE_CODE_ENUM constants
 * and the message to be displayed.
 */
class BadRequestResponse extends ApiResponse {
  constructor(message = "Bad Parameters", details) {
    super(
      STATUS_CODE_ENUM.FAILURE,
      RESPONSE_CODE_ENUM.BAD_REQUEST,
      message,
      details,
      STATUS_ENUM.FAILURE
    )
  }
}

/**
 * @class InternalErrorResponse
 * @classdesc this class should be used to return an internal server error response, its subclasses the
 * abstract @see ApiResponse class and calls its constructor using the @see STATUS_CODE_ENUM, RESPONSE_CODE_ENUM constants
 * and the message to be displayed.
 */
class InternalErrorResponse extends ApiResponse {
  constructor(message = "Internal Error", details) {
    super(
      STATUS_CODE_ENUM.FAILURE,
      RESPONSE_CODE_ENUM.INTERNAL_ERROR,
      message,
      details,
      STATUS_ENUM.FAILURE
    )
  }
}

/**
 * @class AccessTokenErrorResponse
 * @classdesc this class should be used to return an invalid access error response, its subclasses the
 * abstract @see ApiResponse class and calls its constructor using the @see STATUS_CODE_ENUM, RESPONSE_CODE_ENUM constants
 * and the message to be displayed.
 */
class AccessTokenErrorResponse extends ApiResponse {
  constructor(message = "Authentication Failure", details) {
    super(
      STATUS_CODE_ENUM.INVALID_ACCESS_TOKEN,
      RESPONSE_CODE_ENUM.UNAUTHORIZED,
      message,
      details,
      STATUS_ENUM.FAILURE
    )
  }
}

/**
 * @class ExpiredTokenErrorResponse
 * @classdesc this class should be used to return an expired token error response, its subclasses the
 * abstract @see ApiResponse class and calls its constructor using the @see STATUS_CODE_ENUM, RESPONSE_CODE_ENUM constants
 * and the message to be displayed.
 */
class ExpiredTokenErrorResponse extends ApiResponse {
  constructor(message = "Expired Token", details = "Please Check Instruction Header") {
    super(
      STATUS_CODE_ENUM.EXPIRED_ACCESS_TOKEN,
      RESPONSE_CODE_ENUM.UNAUTHORIZED,
      message,
      details,
      STATUS_ENUM.FAILURE
    )
    this.instruction = "Refresh Token"
  }

  send(res) {
    res.setHeader("Instruction", this.instruction)
    return super.prepare(res)
  }
}

/**
 * @class TokenRefreshResponse
 * @classdesc this class should be used to return a token refresh response, its subclasses the
 * abstract @see ApiResponse class and calls its constructor using the @see STATUS_CODE_ENUM, RESPONSE_CODE_ENUM constants
 * and the message to be displayed.
 */
class TokenRefreshResponse extends ApiResponse {
  constructor(message, tokens, details) {
    super(
      STATUS_CODE_ENUM.SUCCESS,
      RESPONSE_CODE_ENUM.SUCCESS,
      message,
      details,
      STATUS_ENUM.FAILURE
    )
    this.data = tokens
  }

  send(res) {
    return super.prepare(res, this.data)
  }
}

/**
 * @class NotFoundResponse
 * @classdesc this class should be used to return a resource not found response, its subclasses the
 * abstract @see ApiResponse class and calls its constructor using the @see STATUS_CODE_ENUM, RESPONSE_CODE_ENUM constants
 * and the message to be displayed.
 */
class NotFoundResponse extends ApiResponse {
  constructor(message = "Not Found", details) {
    super(
      STATUS_CODE_ENUM.FAILURE,
      RESPONSE_CODE_ENUM.NOT_FOUND,
      message,
      details,
      STATUS_ENUM.FAILURE
    )
  }

  /**
   * @override this method overrides the send method in the superclass
   * @param res res response object from expressJs
   * @returns Json Object
   * @description sends the response
   */
  send(res) {
    return super.prepare(res)
  }
}
/**
 * @class DuplicateDataResponse
 * @classdesc this class should be used to return duplicate data responses, its subclasses the
 * abstract @see ApiResponse class and calls its constructor using the @see STATUS_CODE_ENUM, RESPONSE_CODE_ENUM constants
 * and the message to be displayed.
 */
class DuplicateDataResponse extends ApiResponse {
  constructor(message = "Duplicate data provided", details) {
    super(
      STATUS_CODE_ENUM.FAILURE,
      RESPONSE_CODE_ENUM.DUPLICATE_DATA,
      message,
      details,
      STATUS_ENUM.FAILURE
    )
  }

  /**
   * @override this method overrides the send method in the superclass
   * @param res res response object from expressJs
   * @returns Json Object
   * @description sends the response
   */
  send(res) {
    return super.prepare(res)
  }
}

// exports all subclasses of the ApiResponse class as module
module.exports = {
  SuccessResponse,
  CreatedResponse,
  AuthFailureResponse,
  ForbiddenResponse,
  BadRequestResponse,
  InternalErrorResponse,
  NotFoundResponse,
  AccessTokenErrorResponse,
  TokenRefreshResponse,
  ExpiredTokenErrorResponse,
  DuplicateDataResponse,
}
