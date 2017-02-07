var env = "development"; // "production"
var env_config = "";

if (env == "development") {
	env_config = require('./dev_env');
}
else {
	env_config = require('./prod_env');
}

module.exports = {
	config: env_config,
	ENV: env
}
