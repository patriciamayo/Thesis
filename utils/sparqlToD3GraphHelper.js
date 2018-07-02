const graphNode = require('./../models/graphNode')
const graphLink = require('./../models/graphLink')
const sparqlConstants = require('./sparqlConstants.js');

const convertSparqlJsonToD3Graph = (sparqlJson, type, node) => {
    if (type == "children") {
        return getD3JsonChildren(node,sparqlJson)
    } 
    return getD3JsonParents(node,sparqlJson)
}

var getD3JsonChildren = (sourceNode, sparqlJson) => {
    var graphNodes = []
    var graphLinks = []
    for ( const result of sparqlJson.results.bindings ) {
        const keyValues = Object.keys(result)
        const indexOfProperty = sparqlConstants.sparqlChildren.map(property => property.title).indexOf(keyValues[0]);
        const node = new graphNode(result[keyValues[0]].value, result[keyValues[1]].value, indexOfProperty + 1, "children")
        graphNodes.push(node)
        const link = new graphLink(sourceNode.id, node.id, keyValues[0])
        graphLinks.push(link)
    }
    return {graphNodes, graphLinks}
}

var getD3JsonParents = (targetNode, sparqlJson) => {
    var graphNodes = []
    var graphLinks = []
    for ( const result of sparqlJson.results.bindings ) {
        const keyValues = Object.keys(result)
        const indexOfProperty = sparqlConstants.sparqlParents.map(property => property.title).indexOf(keyValues[0]);
        const node = new graphNode(result[keyValues[0]].value, result[keyValues[1]].value, indexOfProperty + 6, "parent")
        graphNodes.push(node)
        const link = new graphLink(node.id, targetNode.id, keyValues[0])
        graphLinks.push(link)
    }
    return {graphNodes, graphLinks}
}

module.exports = {
    convertSparqlJsonToD3Graph,
}