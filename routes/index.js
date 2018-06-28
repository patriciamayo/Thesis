var express = require('express');
var router = express.Router();
const parent = require('./../utils/sparqlConstants').sparqlParent;
const child = require('./../utils/sparqlConstants').sparqlChild;
const sparqlController = require('./sparqlQueryController.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  
  const wikiIdentifier = 'wd:Q395'
  const wikiLabel = 'Mathematics'
  const sparqlQuery = sparqlController.generateQuery(wikiIdentifier, wikiLabel)
  sparqlController.fetchQuery(sparqlQuery).then((sparqlJson) => {
    const d3Json = sparqlController.getD3Json('wd:Q395','Mathematics', sparqlJson )
    res.set('Content-Type', 'application/json');
    res.send(d3Json);
  });

  
});

module.exports = router;
