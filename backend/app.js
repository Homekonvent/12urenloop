let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');



let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');

let app = express();
// Set up Global configuration access
dotenv.config();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
