const fetch = require("node-fetch");
const endpointUrl = 'https://query.wikidata.org/sparql'
const parent = require('./../utils/sparqlConstants').sparqlParent;
const child = require('./../utils/sparqlConstants').sparqlChild;
const sparqlConstants = require('./../utils/sparqlConstants.js');
const graphNode = require('./../models/graphNode')
const graphLink = require('./../models/graphLink')

const deep = 1

var fetchQuery = (sparqlQuery) => {
    const fullUrl = endpointUrl + '?query=' + encodeURIComponent( sparqlQuery );
    const headers = { 'Accept': 'application/sparql-results+json' };
    return fetch( fullUrl, { headers } ).then( body => body.json() ).then( json => { return json;});
};


var generateChildrenQuery = (wikidataIdentifier, wikidataName) => {
    return `#` + wikidataName + `
    SELECT ?field ?fieldLabel WHERE {
      `+ wikidataIdentifier + ` 
      ` + child.hasPart + ` | ` + child.uses + ` | ` + child.followedBy + ` ?field .
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
    }`
}

var generateParentsQuery = (subjectIdentifier, subjectName, propertiesArray) => {
    var selectQuery = ""
    var whereQuery = []
    console.log(sparqlConstants.sparqlParents)
    propertiesArray.forEach(function(property) { 
        selectQuery += "?" + property.title + " ?" + property.title + "Label "
        whereQuery.push(" { " + subjectIdentifier + " " + property.value + " ?" + property.title + " .} ")
    })
    return `#` + subjectName + `
    SELECT ` + selectQuery + ` WHERE {
      ` + whereQuery.join("UNION") + `
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
    }`
}

var getQuery = (wikidataIdentifier, wikidataName, wikidataProperty) => {
    return `#` + wikidataName + `
    SELECT ?field ?fieldLabel WHERE {
      `+ wikidataIdentifier + ` 
      ` + wikidataProperty + ` ?field .
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
    }`
}

var applyQueryForParent = (genesisNode) =>  {
    var graphNodes = [genesisNode]
    var graphLinks = []
    sparqlConstants.sparqlParents.forEach(function(parentProperty) {
        const query = getQuery(genesisNode.id, genesisNode.fieldLabel, parentProperty)
        for ( const result of sparqlJson.results.bindings ) {
            const node = new graphNode(result['field'].value, result['fieldLabel'].value, 1 )
            graphNodes.push(node)
            const link = new graphLink(genesisNode.id, node.id, 'has part')
            graphLinks.push(link)
        }
        return {graphNodes, graphLinks}
    });
}

var generateQuery = (wikidataIdentifier, wikidataName) => {
    return `#` + wikidataName + `
    SELECT ?field ?fieldLabel WHERE {
      `+ wikidataIdentifier + ` ` + child.hasPart + ` ?field .
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
    }`
}

var getD3JsonFormat = (wikidataIdentifier, wikidataName, sparqlJson) => {
    const genesisNode = new graphNode('http://www.wikidata.org/entity/' + wikidataIdentifier, wikidataName, 0)
    var graphNodes = [genesisNode]
    var graphLinks = []
    for ( const result of sparqlJson.results.bindings ) {
        const node = new graphNode(result['field'].value, result['fieldLabel'].value, 1 )
        graphNodes.push(node)
        const link = new graphLink(genesisNode.id, node.id, 'has part')
        graphLinks.push(link)
    }
    return {graphNodes, graphLinks}
}

var getD3Json = (wikidataIdentifier, wikidataName, sparqlJson) => {
    const genesisNode = new graphNode('http://www.wikidata.org/entity/' + wikidataIdentifier, wikidataName, 0)
    var graphNodes = [genesisNode]
    var graphLinks = []
    for ( const result of sparqlJson.results.bindings ) {
        const keyValues = Object.keys(result)
        const indexOfProperty = sparqlConstants.sparqlParents.map(property => property.title).indexOf(keyValues[0]);
        const node = new graphNode(result[keyValues[0]].value, result[keyValues[1]].value, indexOfProperty + 6)
        graphNodes.push(node)
        const link = new graphLink(node.id, genesisNode.id, keyValues[0])
        graphLinks.push(link)
    }
    return {graphNodes, graphLinks}
}

module.exports = {
    generateParentsQuery,
    generateQuery,
    fetchQuery,
    getD3Json
}