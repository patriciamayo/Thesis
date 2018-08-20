const fetch = require("node-fetch");

var fetchClaims = (ids) => {
    const wikidataAPI = "https://www.wikidata.org/w/api.php?action=wbgetentities&props=claims&languages=en&format=json&ids="
    console.log("url => " + wikidataAPI + ids)
    return fetch(wikidataAPI + ids).then( body => body.json() ).then( json => { return json;});
};

var onlyUnique = (value, index, self) => { 
    return self.indexOf(value) === index;
}

var getAllClaimsWithoutFilter = (graphNodes, graphLinks) => {
    return new Promise(function(resolve,reject){
        var analytics = {}
        // get id for each node to call all its properties
        var nodeIds = graphNodes.map(node => {
            return node.id.split("/").pop()
        })

        var linkTypes = graphLinks.map(link => {
            return link.type
        })
        //var propiedadesSinFiltrado = 0
        var nodosSinFiltrado = 0
        fetchClaims(nodeIds.join('|')).then((claimsJson) => {
            var allClaims = []
            nodeIds.forEach(id => {
                // var entity = claimsJson.entities[id]
                // var claims = Object.keys(entity.claims)
                // propiedadesSinFiltrado = propiedadesSinFiltrado + claims.filter(onlyUnique).length
                // var claimValues = claims.map( claim => {

                // })
                // claims.forEach(claim => {
                //     claim
                //     nodosSinFiltrado = nodosSinFiltrado 
                // });
                //totalClaims = totalClaims + Object.keys(entity.claims).length
                var entity = claimsJson.entities[id]
                var claimsKeys = Object.keys(entity.claims)
                allClaims = allClaims.concat(claimsKeys.filter(function (claimKey) {
                    return allClaims.indexOf(claimKey) < 0;
                }));
            });

            analytics.nodosFiltrados = graphNodes.length
            analytics.tiposDeEnlaceFiltrados = linkTypes.filter(onlyUnique).length
            analytics.tiposDeEnlaceSinFiltrado = allClaims.length
            resolve(propiedadesSinFiltrado)
        })
    })
}

module.exports = {
    getAllClaimsWithoutFilter
}