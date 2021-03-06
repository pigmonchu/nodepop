"use strict";

var express = require('express'); 
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var CustomError = require('./lib/customError');
var LanguagesHandler = require('./lib/userLanguages');
var langsHandler;

var app = express();

require('./lib/mongoConnection'); //Conecto a base de datos

//Models
require('./models/Anuncio');
require('./models/User');
 
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* ******************** *
	         RUTAS
* ******************** */

app.use('/apiv1/anuncios', require('./routes/apiv1/anuncios'));
app.use('/apiv1/usuarios', require('./routes/apiv1/users'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    err.status = err.status || 500;
		langsHandler = new LanguagesHandler(req);
		
		if (err.message) {
			err.message = langsHandler.traduction(err.message);
		}

    res.status(err.status);
		if (isAPI(req)) {
			var errorLimpio = new CustomError();
			
			errorLimpio.status(err.status);
			errorLimpio.process(err);
			res.json(errorLimpio);
		} else {
	    res.render('error', {
	      message: err.message,
	      error: err
	    });
		}
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
	langsHandler = new LanguagesHandler(req);		
		
	if (err.message) {
		err.message = langsHandler.traduction(err.message);
	}

	if (isAPI(req)) {
		var errorLimpio = new CustomError();

		errorLimpio.process(err);
		res.json(errorLimpio);
	} else {
	  res.render('error', {
	    message: err.message,
	    error: {}
	  });
	}
});

function isAPI(req) {
	return req.originalUrl.indexOf('/apiv1') === 0;
}

module.exports = app;
