const fetch = require("node-fetch");
const endpointUrl = 'https://query.wikidata.org/sparql'
const parent = require('./../utils/sparqlConstants').sparqlParent;
const child = require('./../utils/sparqlConstants').sparqlChild;
const graphNode = require('./../models/graphNode')
const graphLink = require('./../models/graphLink')

var fetchQuery = function(sparqlQuery) {
    const fullUrl = endpointUrl + '?query=' + encodeURIComponent( sparqlQuery );
    const headers = { 'Accept': 'application/sparql-results+json' };

    return fetch( fullUrl, { headers } ).then( body => body.json() ).then( json => {
    return json;
    // const { head: { vars }, results } = json;
    // for ( const result of results.bindings ) {
    //     for ( const variable of vars ) {
    //         console.log( '%s: %o', variable, result[variable] );
    //     }
    //     console.log( '---' );
    // }
    
    });  
};

var generateQuery = function(wikidataIdentifier) {
    return `#Mathematics
    SELECT ?nodeID ?nodeLabel WHERE {
      wd:Q395 ` + child.hasPart + ` ?nodeID .
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
    }`
}

var getD3Json = function(wikidataIdentifier, wikidataName) {
    const sparqlQuery = generateQuery(wikidataIdentifier)
    let genesisNode = new graphNode(wikidataIdentifier, wikidataName, 0)
    let nodes = [genesisNode]
    let links = []
    fetchQuery(sparqlQuery).then((sparqlResults) => {
        for ( const result of sparqlResults.bindings ) {
            let node = new graphNode(result['nodeID'].value, result['nodeLabel'].value )
            nodes.push(node)
            let link = new graphLink(genesisNode.id, node.id, 'has part')
            links.push(link)
        }
        console.log(nodes);
        console.log(links);
        return {nodes, links}
    });
}

module.exports = {
    fetchQuery,
    getD3Json
}