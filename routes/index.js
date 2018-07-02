var express = require('express');
var router = express.Router();
const d3GraphsController = require('./d3GraphsController.js');
const graphNode = require('./../models/graphNode');

/* GET home page. */
router.get('/wikiquery', function(req, res, next) {
  
  console.log("calling api")
  const deep = req.query.deep || 2
  var id = req.query.id
  
  const genesisNode = new graphNode("http://www.wikidata.org/entity/" + id,"Mathematics", 0, "O")
  var graph = {
    graphNodes: [genesisNode],
    graphLinks: []
  }

  d3GraphsController.generateD3GraphRecursively(deep, 0, graph, genesisNode, "parent").then(graph => {
    d3GraphsController.generateD3GraphRecursively(deep, 0, graph, genesisNode, "children").then(graph => {
      res.set('Content-Type', 'application/json');
      res.send(graph)
    })
  })  
});

module.exports = router;
