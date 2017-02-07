'use strict';
var ENV_CONFIG = require('./config/env_base');
var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var cors = require("cors");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();
var log4js = require('log4js');
var filter = require('content-filter');
log4js.configure('./config/log4js.json');
var log = log4js.getLogger('app');
var db = require('./dal/db').db;
app.use(log4js.connectLogger(log4js.getLogger('http'), {level: 'auto'}));

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
	saveUninitialized: true,
	resave: true,
	secret: "cookiesecret",
	cookie: {maxAge: 10800000 }
}));

var coroptions = {
	credentials: true,
	// methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	origin: true
};

app.use(cors(coroptions));

var api = require('./api/index');

app.use('/', api);

//Sanitize inputs and urls centrally
app.use(filter());

app.use( function(err, req, res, next) {
	if(err){
		console.log("Internal Server Error. Error before next. : "+ err);
	}
	else{
		console.log("Req path: "+req.path);
		try{
			// if(req.user == null || typeof(req.user) == 'undefined'){
			// 	res.status(401).json({"status": 401, "message": "Unauthorized Access"});
			// }
			next();
		}
		catch(e){
			console.log('Internal server error.', err);
			log.error('Internal server error.', err);
		}
	}
});

// error handlers

// development error handler
// will print stacktrace
if (ENV_CONFIG.ENV === 'development') {
	app.use(function(err, req, res, next) {
			if(err){
				console.log("Internal Server Error. Error: "+ err);
				log.error('Internal Server error. Error: ', err);
			}
			res.status(err.status || 500);
			// res.render('error', {
			//     message: err.message,
			//     error: err
			// });
	});
}
/*
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
	message: err.message,
	error: {}
	});
});
*/

var server = app.listen(ENV_CONFIG.config.PORT, function(){
	console.log("App listening on port " + ENV_CONFIG.config.PORT);
});
// secureServer.listen(443, function(){
// 	console.log("App listening on port :" + secureServer.address().port);
// });

//Termicate app gracefully
function terminateApp(){
	//Close database connections
	db.end();
	// Exit server process
	server.close(function() {
		console.log("Closed out remaining connections.");
		process.exit();
	});
}

//Closing app
// listen for TERM signal .e.g. kill
process.on ('SIGTERM', terminateApp);

// listen for INT signal e.g. Ctrl-C
process.on ('SIGINT', terminateApp);

module.exports = app;
