var express = require('express');
var router = express.Router();
const sparqlController = require('./sparqlQueryController.js');
const sparqlConstants = require('./../utils/sparqlConstants.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  
  const wikiIdentifier = 'wd:Q21198'
  const wikiLabel = 'ComputerScience'

  const sparqlParentQuery = sparqlController.generateQuery(wikiIdentifier, wikiLabel, sparqlConstants.sparqlParents)
  const sparqlChildrenQuery = sparqlController.generateQuery(wikiIdentifier, wikiLabel, sparqlConstants.sparqlChildren)
  sparqlController.fetchQuery(sparqlParentQuery).then((sparqlJson) => {
    var d3JsonParents = sparqlController.getD3JsonParents('wd:Q21198','ComputerScience', sparqlJson )
    sparqlController.fetchQuery(sparqlChildrenQuery).then((sparqlJson) => { 
      const d3JsonChildren = sparqlController.getD3JsonChildren('wd:Q21198','ComputerScience', sparqlJson )
      const graphNodesTogether = d3JsonParents["graphNodes"].concat(d3JsonChildren["graphNodes"])
      const graphLinksTogether = d3JsonParents["graphLinks"].concat(d3JsonChildren["graphLinks"])
      const graph = {
	      graphNodes: graphNodesTogether,
  	    graphLinks: graphLinksTogether
      }
      res.set('Content-Type', 'application/json');
      res.send(graph);
    });
  });

  
});

module.exports = router;
