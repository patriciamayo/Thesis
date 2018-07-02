var express = require('express');
var router = express.Router();
const d3GraphsController = require('./d3GraphsController.js');
const d3Graph = require('./../models/graphD3');

/* GET home page. */
router.get('/wikiquery', function(req, res, next) {
  
  const deep = req.query.deep || 2
  var id = req.query.id
  
  d3GraphsController.getEntityGraph(id, 0, "O").then( genesisNode => {
    var graph = {
      graphNodes: [genesisNode],
      graphLinks: []
    }
    d3GraphsController.generateD3GraphRecursively(deep, 0, graph, genesisNode, "parent").then(graph => {
      d3GraphsController.generateD3GraphRecursively(deep, 0, graph, genesisNode, "children").then(graph => {
        d3GraphsController.getCategories(graph).then(categories => {
          const finalGraph = new d3Graph(graph['graphNodes'], graph['graphLinks'], categories)
          res.set('Content-Type', 'application/json');
          res.send(finalGraph)
        })
      })
    })  
  })
});

module.exports = router;
