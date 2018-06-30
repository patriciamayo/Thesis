const fetch = require("node-fetch");
const sparqlConstants = require('./../utils/sparqlConstants.js');

var fetchQuery = (sparqlQuery) => {
    const fullUrl = sparqlConstants.endpointUrl + '?query=' + encodeURIComponent( sparqlQuery );
    const headers = { 'Accept': 'application/sparql-results+json' };
    return fetch( fullUrl, { headers } ).then( body => body.json() ).then( json => { return json;});
};

var generateQueryForType = (type, node) => {
    if (type == "children") {
        return generateQuery(node, sparqlConstants.sparqlChildren)
    } 
    return generateQuery(node, sparqlConstants.sparqlParents)
}

var generateQuery = (node, propertiesArray) => {
    const nodeId = node.id.split("/").pop()
    var selectQuery = ""
    var whereQuery = []
    propertiesArray.forEach(function(property) { 
        selectQuery += "?" + property.title + " ?" + property.title + "Label "
        whereQuery.push(" { wd:" + nodeId + " " + property.value + " ?" + property.title + " .} ")
    })
    return `#` + node.label + `
    SELECT ` + selectQuery + ` WHERE {
      ` + whereQuery.join("UNION") + `
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
    }`
}

module.exports = {
    generateQueryForType,
    fetchQuery,
}