/** @format */

const express = require("express");
const mongoose = require("mongoose");
const todoHandler = require("./routehandler/todoHandler");

// express app initialization
const app = express();
app.use(express.json());

//database connection with mongoose
mongoose
  .connect("mongodb://localhost/todos", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connection is secured"))
  .catch((err) => console.log(err));

//application routes
app.use("/todo", todoHandler);

//error handler
function errorHandler(err, req, res, next) {
  if (res.headesSent) {
    return next(err);
  }
  res.status(500).json({ error: err });
}

app.listen(1234, () => {
  console.log("App is listening at port 1234");
});
