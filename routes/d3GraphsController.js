const sparqlController = require('./sparqlQueryController.js');
const helper = require('./../utils/sparqlToD3GraphHelper.js');

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
    // remove duplicates
    var uniqueNodes = Array.from(new Set(tempGraph["graphNodes"]))
    var uniqueLinks = Array.from(new Set(tempGraph["graphLinks"]))
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
        const d3GraphWithNewNodes = helper.convertSparqlJsonToD3Graph(sparqlJsonResult, type, node)
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

module.exports = {
    generateD3GraphRecursively
}