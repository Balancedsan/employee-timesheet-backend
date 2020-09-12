const ErrorBase = require("../errors/ErrorBase");

const globalErrorHander = (err, req, res, next) => {
  if (err instanceof ErrorBase) {
    const error = err;

    return res.status(error.getHttpStatusCode()).send({
      errorCode: error.getErrorCode(),
      message: error.getMessage(),
    });
  } else {
    return res.status(500).send({
      errorCode: 500,
      message: "Internal Server Error",
    });
  }
};


module.exports = globalErrorHander;
