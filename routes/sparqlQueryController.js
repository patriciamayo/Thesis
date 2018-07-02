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
        selectQuery += "?" + property.title + " ?" + property.title + "Label " + " ?" + property.title + "Description "
        whereQuery.push(" { wd:" + nodeId + " " + property.value + " ?" + property.title + " .} ")
    })
    return `#` + node.label + `
    SELECT ` + selectQuery + ` WHERE {
      ` + whereQuery.join("UNION") + `
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
    }`
}

var getEntityInfo = (id) => {
    const url = "https://www.wikidata.org/w/api.php?action=wbgetentities&props=labels|descriptions&format=json&languages=en&ids="
    return fetch( url + id ).then( body => body.json() ).then( json => { return json;});
}

var getCategoriesQuery = (category) => {
    const url = "https://en.wikipedia.org/w/api.php?action=query&list=categorymembers&cmlimit=40&format=json&cmtype=subcat|page&cmtitle=Category:"
    return fetch( url + category ).then( body => body.json() ).then( json => { return json;});
}

module.exports = {
    generateQueryForType,
    fetchQuery,
    getEntityInfo,
    getCategoriesQuery
}