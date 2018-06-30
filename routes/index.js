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

  const deep = 2
  

  const merge2GraphsTogether = (graph1, graph2) => {
    //console.log("MERGE THOSE GRAPHS TOGETHER")
    //console.log(graph1)
    //console.log("===========================")
    //console.log(graph2)
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

  function getContacts(vid,key){
    var contacts = []
    return new Promise(function(resolve,reject){

        toCall(0)
        //need this extra fn due to recursion
        function toCall(vid){

                axios.get('https://api.hubapi.com/contacts/v1/lists/all/contacts/all?hapikey=e5ca5aac-d9e0-4d2c-aeed-93179d563c6c&vidOffset='+vid)
                .then(response =>{
                contacts = contacts.concat(response.data.contacts)
                if (response.data['has-more']){
                  toCall(response.data['vid-offset'])      
                }else{      
                    resolve(contacts)
                }
              })
        }
    })
  }

function getGraph(branch, graphFirst, node) {
  var graph = graphFirst
  return new Promise(function(resolve,reject){

    recursiveChildren(branch, graph, node)


  })
}

function recursiveChildren(branch, graph, node) {
  return new Promise(function(resolve,reject){
  if (branch == deep) {
    console.log("leaf reached Resolve promise ============== " + node.label)
    console.log(graph)
    resolve(graph)
  } else {
    console.log("BRANCH: ==== " + branch)
    console.log("NODE: ==== " + node.label)
    console.log("CURRENT GRAPH: ==== ")
    console.log(graph)

    const sparqlChildrenQuery = sparqlController.generateQuery(node, sparqlConstants.sparqlChildren)
    sparqlController.fetchQuery(sparqlChildrenQuery).then((sparqlJson) => {
      const d3JsonChildren = sparqlController.getD3JsonChildren(node, sparqlJson )
      //console.log("what is this???")
      const graphFinal = mergeArrayOfGraphs([graph, d3JsonChildren])
      const childrenNodes = d3JsonChildren["graphNodes"]
      var promises = childrenNodes.map(node => {
        console.log("Open new promise for node " + node.label)
        return recursiveChildren(branch + 1, graphFinal, node).then( graph => {
          console.log("promise should be close here also now " + node.label)
          return graph
        })
      })
      Promise.all(promises).then(function(results) {
          console.log("for some reason results dont work")
          console.log(results)
          resolve(mergeArrayOfGraphs(results))
      })
      // const graphOfAllChildren = mergeArrayOfGraphs(childrenNodes.map(node => {
      //   return recursiveChildren(branch + 1, graphFinal, node)
      // }))
      // return graphOfAllChildren
    });
  }
})
}

function mapChildrenNodes(childrenNodes) {
  return new Promise(function(resolve,reject){
    resolve(childrenNodes.map(node => {
      return recursiveChildren(branch + 1, graphFinal, node)
    }))
  })
}

  function recursiveChildren2(branch, graph, node) {
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
  //const test =  
  recursiveChildren(0, graph, genesisNode).then(graph => {
    console.log("test is back ->>>>")
    console.log(graph)
    //const newTest = mergeArrayOfGraphs(graph)
    //console.log(graph)
  })
  
  // res.set('Content-Type', 'application/json');
  // res.send(test)
  
});

module.exports = router;
