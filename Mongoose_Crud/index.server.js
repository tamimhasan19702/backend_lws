/** @format */

const express = require("express");

// express app initialization
const app = express();
app.use(express.json());

//application routes


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
