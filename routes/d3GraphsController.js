const sparqlController = require('./sparqlQueryController.js');
const helper = require('./../utils/sparqlToD3GraphHelper.js');


var getCategories = (graph) => {
  const links = graph['graphLinks']
  var categoriesFromGraph = links.filter(link => link.type == 'CommonCategory')
  return new Promise(function(resolve,reject){
    var promises = categoriesFromGraph.map(category => {
      return sparqlController.getCategoriesQuery(category.source).then( sparqlJson => {
        return helper.convertJsonToGraphCategories(sparqlJson, category.source)
      })
    })
    Promise.all(promises).then(function(results) {
        resolve(results)
    })
  })
}

const merge2GraphsTogether = (graph1, graph2) => {
    const graphNodesTogether = graph1["graphNodes"].concat(graph2["graphNodes"])
    const graphLinksTogether = graph1["graphLinks"].concat(graph2["graphLinks"])
    const graphFinal = {
      graphNodes: graphNodesTogether,
      graphLinks: graphLinksTogether
    }
    return graphFinal
}

const mergeArrayOfGraphs = (graphsArray) => {
    var tempGraph = {
      graphNodes: [],
      graphLinks: []
    }
    graphsArray.forEach(function(graph) { 
      tempGraph = merge2GraphsTogether(tempGraph, graph)
    })
    return removeDuplicates(tempGraph)
}

const removeDuplicates = (graph) => {    
    var uniqueLinks = Array.from(new Set(graph["graphLinks"]))

    var uniqueNodes = graph["graphNodes"].filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj['id']).indexOf(obj['id']) === pos;
    })
    return {
        graphNodes: uniqueNodes,
        graphLinks: uniqueLinks
    }
}

var generateD3GraphRecursively = (maxDeep, branch, graph, node, type) => {
  return new Promise(function(resolve,reject){
    // The deepest node we wanted to reach resolves the promise
    if (branch == maxDeep) {
      resolve(graph)
    } else {
      const sparqlQuery = sparqlController.generateQueryForType(type, node)
      // Fetch data from wikidata with sparql query
      sparqlController.fetchQuery(sparqlQuery).then((sparqlJsonResult) => {
        const d3GraphWithNewNodes = helper.convertSparqlJsonToD3Graph(sparqlJsonResult, type, branch+1, node)
        // The current node doesn't have more children/parents so we can resolve with the current graph
        if (d3GraphWithNewNodes["graphNodes"].length == 0) {
          resolve(graph)
        } else {
          const newGraph = mergeArrayOfGraphs([graph, d3GraphWithNewNodes])
          const newNodes = d3GraphWithNewNodes["graphNodes"]
          // for each children/parent we create a new promise of a graph
          var promises = newNodes.map(newNode => {
            return generateD3GraphRecursively(maxDeep, branch + 1, newGraph, newNode, type).then( graph => {
              return graph
            })
          })
          // when all new nodes have resolved their own graphs we merge them together and resolve the final promise
          Promise.all(promises).then(function(results) {
              resolve(mergeArrayOfGraphs(results))
          })
        }
      });
    }
  })
}

var getEntityGraph = (id, group, position) => {
    return new Promise(function(resolve,reject){
        sparqlController.getEntityInfo(id).then( sparqlJson => {
            resolve(helper.convertJsonToGraphNode(sparqlJson, id, group, position))
        })
    })
}

module.exports = {
    getCategories,
    getEntityGraph,
    generateD3GraphRecursively
}