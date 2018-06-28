var express = require('express');
var router = express.Router();
const parent = require('./../utils/sparqlConstants').sparqlParent;
const child = require('./../utils/sparqlConstants').sparqlChild;
const sparqlController = require('./sparqlQueryController.js');

/* GET home page. */
router.get('/', function(req, res, next) {

      const sparqlQuery = `#Mathematics
      SELECT ?field ?fieldLabel WHERE {
        wd:Q395 ` + child.hasPart + ` ?field .
        SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
      }`
  
  // sparqlController.fetchQuery(sparqlQuery).then((result) => {
  //   res.set('Content-Type', 'application/json');
  //   res.send(result);
  // });

  sparqlController.getD3Json('wd:Q395','Mathematics').then((result) => {
    res.set('Content-Type', 'application/json');
    res.send(result);
  });
});

module.exports = router;
