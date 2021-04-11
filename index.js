const makerplace = require('./tasks/makerplace');
const opeansea = require('./tasks/opeansea');
const nitfygateway = require('./tasks/niftygateway');
const config = require('./config.js');
opeansea.buildAndProcessData('./opeansea.csv', config.username.opensea, 100);
nitfygateway.buildAndProcessData('./niftygateway.csv', config.username.niftygateway);
makerplace.buildAndProcessData("./makerplace.csv", config.username.makerplace);