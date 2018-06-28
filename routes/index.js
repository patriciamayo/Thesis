var express = require('express');
var router = express.Router();
var Rectangle = require('./../models/rectangle');
var fetch = require("node-fetch");

/* GET home page. */
router.get('/', function(req, res, next) {


  const square = new Rectangle(20, 10);

  console.log(square); // 100

  const endpointUrl = 'https://query.wikidata.org/sparql',
      sparqlQuery = `#Cats
SELECT ?item ?itemLabel WHERE {
  ?item wdt:P136 wd:Q146.
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
