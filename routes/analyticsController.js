const fetch = require("node-fetch");

var fetchClaims = (ids) => {
    const wikidataAPI = "https://www.wikidata.org/w/api.php?action=wbgetentities&props=claims&languages=en&format=json&ids="
    return fetch(wikidataAPI + ids).then( body => body.json() ).then( json => { return json;});
};

var onlyUnique = (value, index, self) => { 
    return self.indexOf(value) === index;
}

var getFilterUnfilterStats = (graphNodes, graphLinks) => {
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
            var allUnfilteredClaims = []
            var allUnfilteredClaimValues = []
            nodeIds.forEach(id => {
                var entity = claimsJson.entities[id]
                var claimsKeys = Object.keys(entity.claims)
                allUnfilteredClaims = allUnfilteredClaims.concat(claimsKeys.filter(function (claimKey) {
                    return allUnfilteredClaims.indexOf(claimKey) < 0;
                }));
                claimsKeys.forEach(claimKey => {
                    var claimValues = entity.claims[claimKey].map(claimValue => {
                        return claimValue.mainsnak.datavalue.value.id
                    })
                    allUnfilteredClaimValues = allUnfilteredClaimValues.concat(claimValues.filter(function(claimValue) {
                        return allUnfilteredClaimValues.indexOf(claimValue) < 0;
                    }))
                });
            });

            console.log("analytics.filteredNodes => " + graphNodes.length)
            console.log("analytics.unfilteredNodes => " + allUnfilteredClaimValues.length)
            console.log("analytics.filteredLinkTypes => " + linkTypes.filter(onlyUnique).length)
            console.log("analytics.unfilteredLinkTypes => " + allUnfilteredClaims.length)
            analytics.filteredNodes = graphNodes.length
            analytics.unfilteredNodes = allUnfilteredClaimValues.length
            analytics.filteredLinkTypes = linkTypes.filter(onlyUnique).length
            analytics.unfilteredLinkTypes = allUnfilteredClaims.length
            resolve(analytics)
        })
    })
}

module.exports = {
    getFilterUnfilterStats
}