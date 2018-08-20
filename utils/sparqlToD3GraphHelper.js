const graphNode = require('./../models/graphNode')
const graphLink = require('./../models/graphLink')
const graphCategoryItem = require('./../models/graphCategoryItem')
const graphCategories = require('./../models/graphCategories')
const sparqlConstants = require('./sparqlConstants.js');
const sparqlController = require('./../routes/sparqlQueryController.js');

const convertJsonToGraphNode = (sparqlJson, id, group, position) => {
    let label = sparqlJson.entities[id].labels.en.value
    let description = sparqlJson.entities[id].descriptions.en.value
    return new graphNode("http://www.wikidata.org/entity/" + id,label, description, group, position)
}

const convertJsonToGraphCategories = (sparqlJson, id) => {
    const subcategories = sparqlJson.query.categorymembers.filter( member => member.title.indexOf('Category') >= 0 )
    const pages = sparqlJson.query.categorymembers.filter( member => member.title.indexOf('Category') < 0 )
    const graphSubcategories = []
    const graphPages = []
    for ( const subcategory of subcategories ) {
        graphSubcategories.push(new graphCategoryItem(subcategory.pageid, subcategory.title))
    }
    for ( const page of pages ) {
        graphPages.push(new graphCategoryItem(page.pageid, page.title))
    }
    return new graphCategories(id,graphSubcategories, graphPages)
}

const convertSparqlJsonToD3Graph = (sparqlJson, type, deepLevel, node) => {
    if (type == "children") {
        return getD3JsonChildren(node, deepLevel, sparqlJson)
    } 
    return getD3JsonParents(node, deepLevel, sparqlJson)
}

var getD3JsonChildren = (sourceNode, deepLevel, sparqlJson) => {
    var graphNodes = []
    var graphLinks = []
    for ( const result of sparqlJson.results.bindings ) {
        const keyValues = Object.keys(result)
        var description = ""
        if (keyValues.length == 3) {
            description = result[keyValues[2]].value
        }
        const indexOfProperty = sparqlConstants.sparqlChildren.map(property => property.title).indexOf(keyValues[0]);
        const node = new graphNode(result[keyValues[0]].value, result[keyValues[1]].value, description, indexOfProperty + 1, deepLevel)
        graphNodes.push(node)
        const link = new graphLink(sourceNode.id, node.id, keyValues[0])
        graphLinks.push(link)
    }
    return {graphNodes, graphLinks}
}

var getD3JsonParents = (targetNode, deepLevel, sparqlJson) => {
    var graphNodes = []
    var graphLinks = []
    for ( const result of sparqlJson.results.bindings ) {
        const keyValues = Object.keys(result)
        var description = ""
        if (keyValues.length == 3) {
            description = result[keyValues[2]].value
        }
        const indexOfProperty = sparqlConstants.sparqlParents.map(property => property.title).indexOf(keyValues[0]);
        const node = new graphNode(result[keyValues[0]].value, result[keyValues[1]].value, description, indexOfProperty + 6, deepLevel*(-1))
        graphNodes.push(node)
        const link = new graphLink(node.id, targetNode.id, keyValues[0])
        graphLinks.push(link)
    }
    return {graphNodes, graphLinks}
}

module.exports = {
    convertJsonToGraphCategories,
    convertJsonToGraphNode,
    convertSparqlJsonToD3Graph,
}