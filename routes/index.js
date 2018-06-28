var express = require('express');
var router = express.Router();
var Rectangle = require('./../models/rectangle');
var fetch = require("node-fetch");
const parent = require('./../utils/sparqlConstants').sparqlParent;
const child = require('./../utils/sparqlConstants').sparqlChild;

/* GET home page. */
router.get('/', function(req, res, next) {
  
  const endpointUrl = 'https://query.wikidata.org/sparql',
      sparqlQuery = `#Mathematics
      SELECT ?field ?fieldLabel WHERE {
        wd:Q395 ` + parent.instanceOf + ` ?field .
        SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
      }`,
      fullUrl = endpointUrl + '?query=' + encodeURIComponent( sparqlQuery ),
      headers = { 'Accept': 'application/sparql-results+json' };

fetch( fullUrl, { headers } ).then( body => body.json() ).then( json => {
    const { head: { vars }, results } = json;
    for ( const result of results.bindings ) {
        for ( const variable of vars ) {
            console.log( '%s: %o', variable, result[variable] );
        }
        console.log( '---' );
    }
} );

  res.render('index', { title: 'Express' });
});

module.exports = router;
