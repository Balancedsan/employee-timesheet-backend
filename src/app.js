const express = require('express');
const App = express();
const cors = require("cors");
const morgan = require("morgan");
const globalErrorHandler = require("./middleware/globalErrorHandler");
const router = require("./router");

App.use(express.json());
App.use(morgan("dev"));
App.use(cors());
App.use("/api",router);
App.use(globalErrorHandler);

module.exports = App;
