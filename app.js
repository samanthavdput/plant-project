require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');

const app = express();
//     |
//     |-----------------------------|
// use session here:                 V
require('./configs/session.config')(app);

// require database configuration
require('./configs/db.config');

// Middleware Setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// default value for title local
app.locals.title = 'Plants - Module 2 Project';

// const index = require('./routes/index');
// app.use('/', index);
//      |  |  |
//      V  V  V
app.use('/', require('./routes/index.routes'));

const authRouter = require('./routes/auth.routes');
app.use('/', authRouter);

module.exports = app;
