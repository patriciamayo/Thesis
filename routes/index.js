var express = require('express');
var router = express.Router();
const d3GraphsController = require('./d3GraphsController.js');
const graphNode = require('./../models/graphNode')

/* GET home page. */
router.get('/', function(req, res, next) {
  

  const deep = 2  
  const genesisNode = new graphNode("http://www.wikidata.org/entity/Q395","Mathematics", 0)
  var graph = {
    graphNodes: [genesisNode],
    graphLinks: []
  }

  d3GraphsController.generateD3GraphRecursively(deep, 0, graph, genesisNode, "parent").then(graph => {
    d3GraphsController.generateD3GraphRecursively(deep, 0, graph, genesisNode, "children").then(graph => {
      console.log(graph)
      res.set('Content-Type', 'application/json');
      res.send(graph)
    })
  })  
});

module.exports = router;
