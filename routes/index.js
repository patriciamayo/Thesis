var express = require('express');
var router = express.Router();
const d3GraphsController = require('./d3GraphsController.js');
const wikipeidaController = require('./wikipediaController.js');
const d3Graph = require('./../models/graphD3');
const analytics = require('./analyticsController.js');

/* GET home page. */
router.get('/wikiquery', function(req, res, next) {
  
  const deep = req.query.deep || 2
  var id = req.query.id
  
  d3GraphsController.getEntityGraph(id, 0, 0).then( genesisNode => {
    var graph = {
      graphNodes: [genesisNode],
      graphLinks: []
    }
    d3GraphsController.generateD3GraphRecursively(deep, 0, graph, genesisNode, "parent").then(graph => {
      d3GraphsController.generateD3GraphRecursively(deep, 0, graph, genesisNode, "children").then(graph => {
        d3GraphsController.getCategories(graph).then(categories => {
          var finalGraph = new d3Graph(graph['graphNodes'], graph['graphLinks'], categories)
          analytics.getFilterUnfilterStats(graph['graphNodes'], graph['graphLinks']).then(stats => {
            finalGraph.analytics = stats
            res.set('Content-Type', 'application/json');
            res.send(finalGraph)
          })
        })
      })
    })  
  })
});

/* GET home page. */
router.get('/page', function(req, res, next) {
  var url = req.query.url
  console.log("VAR is " + url) 
  wikipeidaController.getWikipedia(url).then(links => {
    res.set('Content-Type', 'application/json');
    res.send(links)
  }) 
});

module.exports = router;
