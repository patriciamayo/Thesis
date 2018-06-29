var express = require('express');
var router = express.Router();
const sparqlController = require('./sparqlQueryController.js');
const sparqlConstants = require('./../utils/sparqlConstants.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  
  const wikiIdentifier = 'wd:Q21198'
  const wikiLabel = 'ComputerScience'

  const deep = 2
  var graph = {
    graphNodes: [],
    graphLinks: []
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
    return tempGraph
  }

  const sparqlParentQuery = sparqlController.generateQuery(wikiIdentifier, wikiLabel, sparqlConstants.sparqlParents)
  const sparqlChildrenQuery = sparqlController.generateQuery(wikiIdentifier, wikiLabel, sparqlConstants.sparqlChildren)
  sparqlController.fetchQuery(sparqlParentQuery).then((sparqlJson) => {
    var d3JsonParents = sparqlController.getD3JsonParents('wd:Q21198','ComputerScience', sparqlJson )
    
    sparqlController.fetchQuery(sparqlChildrenQuery).then((sparqlJson) => { 
      const d3JsonChildren = sparqlController.getD3JsonChildren('wd:Q21198','ComputerScience', sparqlJson )
      const graph = mergeArrayOfGraphs([d3JsonParents, d3JsonChildren]) //mergeGraphTogether(d3JsonParents, d3JsonChildren)
      res.set('Content-Type', 'application/json');
      res.send(graph);
    });

  });



  var recursiveChildren = (branch, graph, nodeIdentifier, nodeLabel ) => {
    if (branch == deep) {
      console.log("leaf reached ============== ")
      return graph
    } else {
      const sparqlChildrenQuery = sparqlController.generateQuery(nodeIdentifier, nodeLabel, sparqlConstants.sparqlChildren)
      sparqlController.fetchQuery(sparqlChildrenQuery).then((sparqlJson) => { 
        const d3JsonChildren = sparqlController.getD3JsonChildren(nodeIdentifier,nodeLabel, sparqlJson )
        const graphFinal = mergeGraphTogether(graph, d3JsonChildren)
        d3JsonChildren["graphNodes"].forEach(function(node) {
          const identifier = node.id.split("/").pop()
          const label = node.label
          return recursiveChildren(branch + 1, graphFinal, "wd:" + identifier,label)
        })
      });
    }
  }

  //const test =  recursiveChildren(0, graph, "wd:Q21198", "Computer Sciences")
  // console.log(test)
  // res.set('Content-Type', 'application/json');
  // res.send(test)
  
});

module.exports = router;
