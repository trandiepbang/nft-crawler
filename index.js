// const makerplace = require('./tasks/makerplace');
const opeansea = require('./tasks/opeansea');
// const nitfygateway = require('./tasks/niftygateway');
opeansea.buildAndProcessData('./opeansea.csv', ["itsheyjeli"], 100);
// nitfygateway.buildAndProcessData('./niftygateway.csv', ['itsheyjeli']);
// makerplace.buildAndProcessData("./makerplace.csv", ["itsheyjeli"]);