const fs = require('fs');
const path = require('path');
const makerplace = require('./tasks/makerplace');
const opeansea = require('./tasks/opeansea');
const nitfygateway = require('./tasks/niftygateway');
const config = require('./config.js');
if (!fs.existsSync(config.data)) {
    fs.mkdirSync(config.data);
}

opeansea.buildAndProcessData(path.join(config.data, '/opeansea.csv'), config.username.opensea, 100);
nitfygateway.buildAndProcessData(path.join(config.data,'/niftygateway.csv'), config.username.niftygateway);
makerplace.buildAndProcessData(path.join(config.data, "/makerplace.csv"), config.username.makerplace);