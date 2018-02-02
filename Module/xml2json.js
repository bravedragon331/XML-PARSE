var convert = require('xml-to-json-promise');

module.exports = async function(xmlPath){
    return await convert.xmlFileToJSON(xmlPath);
}