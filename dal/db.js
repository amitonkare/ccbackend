var mysql = require('mysql');
var ENV_CONFIG = require('../config/env_base');

var connection = mysql.createConnection({
	host: ENV_CONFIG.config.DBPARAMS.host,
	user: ENV_CONFIG.config.DBPARAMS.user,
	password: ENV_CONFIG.config.DBPARAMS.password,
	database: ENV_CONFIG.config.DBPARAMS.database
});

connection.connect(function(err){
	if(!err){
		console.log("Database is connected.");
	}
	else{
		console.log("Error connecting database."+ err);
	}
});

module.exports.db = connection;
