import AppError from "../utils/AppError.js";

const handelCastErrorDB = (err) => {
  const message = `Invalid  ${err.path} : ${err.value} `;
  return new AppError(message, 400);
};
const handelDuplicateFieldsDB = (err) => {
  const value = err.keyValue ? Object.values(err.keyValue)[0] : "";
  const message = `Duplicate value "${value}". Please use another value!`;
  return new AppError(message, 400);
};

const handelValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handelJWTError = () => {
  return new AppError("Invalid token. Please log in again!", 401);
};
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    err: err,
    stack: err.stack,
  });
};
const handelFileSizeError = (err) => {
  return new AppError("File is too large! Maximum size allowed is 5MB", 400);
};
const sendErrorProd = (err, res) => {
  //isOperational send to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // programming error or unknown error , do not leake the erro to client
  } else {
    //1) log the error
    //2) send the responce
    res.status(500).json({
      status: "error",
      message: "something went very wronge!",
    });
  }
};
export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;
    error.name = err.name;
    if (error.name === "CastError") error = handelCastErrorDB(error);
    if (error.code === 11000) error = handelDuplicateFieldsDB(error);
    if (error.name === "ValidationError") error = handelValidationError(error);
    if (error.name === "JsonWebTokenError") error = handelJWTError();
    if (error.name === "TokenExpiredError") error = handelJWTError();
    if (error.code === "LIMIT_FILE_SIZE") error = handelFileSizeError();

    sendErrorProd(error, res);
  }
};
