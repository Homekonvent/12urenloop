const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');


const app = express();
app.set("view engine", "ejs");
// Set up Global configuration access
dotenv.config();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'static')));

app.use(function (req, res, next) {
  if (req.url.startsWith("css")) {
    req.url = "static/" + req.url;
  }
  if (req.url.startsWith("fonts")) {
    req.url = "static/" + req.url;
  }
  if (req.url.startsWith("images")) {
    req.url = "static/" + req.url;
  }
  if (req.url.startsWith("js")) {
    req.url = "static/" + req.url;
  }
  next();
});

app.get("/", function (req, res) {
  res.render("index", {});
});

module.exports = app;
