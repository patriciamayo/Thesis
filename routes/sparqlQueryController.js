const fetch = require("node-fetch");
const endpointUrl = 'https://query.wikidata.org/sparql'
const parent = require('./../utils/sparqlConstants').sparqlParent;
const child = require('./../utils/sparqlConstants').sparqlChild;
const graphNode = require('./../models/graphNode')
const graphLink = require('./../models/graphLink')

var fetchQuery = (sparqlQuery) => {
    const fullUrl = endpointUrl + '?query=' + encodeURIComponent( sparqlQuery );
    const headers = { 'Accept': 'application/sparql-results+json' };
    return fetch( fullUrl, { headers } ).then( body => body.json() ).then( json => { return json;});
};

var generateQuery = (wikidataIdentifier, wikidataName) => {
    return `#` + wikidataName + `
    SELECT ?field ?fieldLabel WHERE {
      `+ wikidataIdentifier + ` ` + child.hasPart + ` ?field .
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
    }`
}

var getD3Json = (wikidataIdentifier, wikidataName, sparqlJson) => {
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

module.exports = {
    generateQuery,
    fetchQuery,
    getD3Json
}