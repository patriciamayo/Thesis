var express = require('express');
var router = express.Router();
const sparqlController = require('./sparqlQueryController.js');
const sparqlConstants = require('./../utils/sparqlConstants.js');
const graphNode = require('./../models/graphNode')
const graphLink = require('./../models/graphLink')

/* GET home page. */
router.get('/', function(req, res, next) {
  
  const wikiIdentifier = 'wd:Q21198'
  const wikiLabel = 'ComputerScience'

  const deep = 1
  

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
    var uniqueNodes = Array.from(new Set(tempGraph["graphNodes"]))
    var uniqueLinks = Array.from(new Set(tempGraph["graphLinks"]))
    return {
      graphNodes: uniqueNodes,
      graphLinks: uniqueLinks
    }
  }

  // const sparqlParentQuery = sparqlController.generateQuery(wikiIdentifier, wikiLabel, sparqlConstants.sparqlParents)
  // const sparqlChildrenQuery = sparqlController.generateQuery(wikiIdentifier, wikiLabel, sparqlConstants.sparqlChildren)
  // sparqlController.fetchQuery(sparqlParentQuery).then((sparqlJson) => {
  //   var d3JsonParents = sparqlController.getD3JsonParents('wd:Q21198','ComputerScience', sparqlJson )
    
  //   sparqlController.fetchQuery(sparqlChildrenQuery).then((sparqlJson) => { 
  //     const d3JsonChildren = sparqlController.getD3JsonChildren('wd:Q21198','ComputerScience', sparqlJson )
  //     const graph = mergeArrayOfGraphs([d3JsonParents, d3JsonChildren]) //mergeGraphTogether(d3JsonParents, d3JsonChildren)
  //     res.set('Content-Type', 'application/json');
  //     res.send(graph);
  //   });

  // });



  var recursiveChildren = (branch, graph, node) => {
    if (branch == deep) {
      console.log("leaf reached ============== " + node.label)
      console.log(graph)
      return graph
    } else {
      console.log("BRANCH: ==== " + branch)
      console.log("GRAPH: ==== ")
      console.log(graph)
      //console.log("RootNode ==== " + rootNode.label)
      //console.log("LeafNode: ==== " + node.label)
      const sparqlChildrenQuery = sparqlController.generateQuery(node, sparqlConstants.sparqlChildren)
      //console.log("=======")
      
      //console.log(sparqlChildrenQuery)
      //console.log("=======")
      //console.log("=======")

      sparqlController.fetchQuery(sparqlChildrenQuery).then((sparqlJson) => {
        //console.log("======= FETCH QUERY DONE =======")
        const d3JsonChildren = sparqlController.getD3JsonChildren(node, sparqlJson )
        //console.log("======= d3JsonChildren DONE =======")
        const graphFinal = mergeArrayOfGraphs([graph, d3JsonChildren])
        //console.log("======= graph Final done DONE =======")
        //console.log("=======")
        //console.log("=======")
        //console.log(graphFinal)
        const childrenNodes = d3JsonChildren["graphNodes"]
        //console.log("CHILDREN NODES =======")
        //console.log(childrenNodes)
        const graphOfAllChildren = mergeArrayOfGraphs(childrenNodes.map(node => {
          //const identifier = node.id.split("/").pop()
          //const label = node.label
          return recursiveChildren(branch + 1, graphFinal, node)
        }))
        return graphOfAllChildren
        // d3JsonChildren["graphNodes"].forEach(function(node) {
        //   const identifier = node.id.split("/").pop()
        //   const label = node.label
        //   return recursiveChildren(branch + 1, graphFinal, "wd:" + identifier,label)
        // })
      });
    }
  }

  const genesisNode = new graphNode("http://www.wikidata.org/entity/Q21198","Computer Sciences", 0)
  var graph = {
    graphNodes: [genesisNode],
    graphLinks: []
  }
  const test =  recursiveChildren(0, graph, genesisNode)
  console.log("test is back ->>>>" + test)
  // res.set('Content-Type', 'application/json');
  // res.send(test)
  
});

module.exports = router;
