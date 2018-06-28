const fetch = require("node-fetch");
const endpointUrl = 'https://query.wikidata.org/sparql'

var fetchQuery = function(sparqlQuery) {
    const fullUrl = endpointUrl + '?query=' + encodeURIComponent( sparqlQuery );
    const headers = { 'Accept': 'application/sparql-results+json' };

    return fetch( fullUrl, { headers } ).then( body => body.json() ).then( json => {
        
    const { head: { vars }, results } = json;
    for ( const result of results.bindings ) {
        for ( const variable of vars ) {
            console.log( '%s: %o', variable, result[variable] );
        }
        console.log( '---' );
    }
    return json;
    });  
};

module.exports = {
    fetchQuery
}