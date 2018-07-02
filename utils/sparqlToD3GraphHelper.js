const graphNode = require('./../models/graphNode')
const graphLink = require('./../models/graphLink')
const sparqlConstants = require('./sparqlConstants.js');

const convertJsonToGraphNode = (sparqlJson, id, group, position) => {
    let label = sparqlJson.entities[id].labels.en.value
    let description = sparqlJson.entities[id].descriptions.en.value
    return new graphNode("http://www.wikidata.org/entity/" + id,label, description, group, position)
}

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
        var description = ""
        if (keyValues.length == 3) {
            description = result[keyValues[2]].value
        }
        const indexOfProperty = sparqlConstants.sparqlChildren.map(property => property.title).indexOf(keyValues[0]);
        const node = new graphNode(result[keyValues[0]].value, result[keyValues[1]].value, description, indexOfProperty + 1, "children")
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
        var description = ""
        if (keyValues.length == 3) {
            description = result[keyValues[2]].value
        }
        const indexOfProperty = sparqlConstants.sparqlParents.map(property => property.title).indexOf(keyValues[0]);
        const node = new graphNode(result[keyValues[0]].value, result[keyValues[1]].value, description, indexOfProperty + 6, "parent")
        graphNodes.push(node)
        const link = new graphLink(node.id, targetNode.id, keyValues[0])
        graphLinks.push(link)
    }
    return {graphNodes, graphLinks}
}

module.exports = {
    convertJsonToGraphNode,
    convertSparqlJsonToD3Graph,
}