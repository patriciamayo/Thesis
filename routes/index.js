var express = require('express');
var router = express.Router();
const parent = require('./../utils/sparqlConstants').sparqlParent;
const child = require('./../utils/sparqlConstants').sparqlChild;
const sparqlController = require('./sparqlQueryController.js');
const sparqlConstants = require('./../utils/sparqlConstants.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  
  const wikiIdentifier = 'wd:Q395'
  const wikiLabel = 'Mathematics'

  //console.log(sparqlController.generateParentsQuery(wikiIdentifier, wikiLabel, sparqlConstants.sparqlParents))

  //const sparqlQuery = sparqlController.generateQuery(wikiIdentifier, wikiLabel)
  console.log( sparqlConstants.sparqlParents)
  const sparqlQuery = sparqlController.generateParentsQuery(wikiIdentifier, wikiLabel, sparqlConstants.sparqlParents)
  sparqlController.fetchQuery(sparqlQuery).then((sparqlJson) => {
    const d3Json = sparqlController.getD3Json('wd:Q395','Mathematics', sparqlJson )
    res.set('Content-Type', 'application/json');
    res.send(d3Json);
  });

  
});

module.exports = router;
