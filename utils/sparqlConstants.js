const sparqlParent = {
    instanceOf: 'wdt:P31',
    partOf: 'wdt:P361',	
    hasPartsOf: 'wdt:P2670',
    subclassOf: 'wdt:P279',
    follows: 'wdt:P155',
    usedBy: 'wdt:P1535'	
}

const sparqlChild = {
    hasPart: 'wdt:P527',
    followedBy: 'wdt:P156',
    uses: 'wdt:P2283'
}

module.exports = {
sparqlChild,
sparqlParent
};