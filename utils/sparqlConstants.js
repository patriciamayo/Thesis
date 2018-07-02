const endpointUrl = 'https://query.wikidata.org/sparql'

const sparqlParent = {
    instanceOf: 'wdt:P31',
    partOf: 'wdt:P361',	
    hasPartsOf: 'wdt:P2670',
    subclassOf: 'wdt:P279',
    follows: 'wdt:P155',
    usedBy: 'wdt:P1535',
    basedOn: 'wdt:P144',
    category: 'wdt:P373'
}

const sparqlChild = {
    hasPart: 'wdt:P527',
    followedBy: 'wdt:P156',
    uses: 'wdt:P2283',
    derivatesFrom: 'wdt:P4969'
}

const sparqlParents = [
    {
        title: 'instanceOf',
        value: sparqlParent.instanceOf
    },
    {
        title: 'partOf',
        value: sparqlParent.partOf
    },
    {
        title: 'hasPartOf',
        value: sparqlParent.hasPartsOf
    },
    {
        title: 'subclassOf',
        value: sparqlParent.subclassOf
    },
    {
        title: 'follows',
        value: sparqlParent.follows
    },
    {
        title: 'usedBy',
        value: sparqlParent.usedBy
    },
    {
        title: 'basedOn',
        value:sparqlParent.basedOn
    },
    {
        title: 'CommonCategory',
        value: sparqlParent.category
    }
]

const sparqlChildren = [
    {
        title: 'hasPart',
        value: sparqlChild.hasPart
    },
    {
        title: 'followedBy',
        value: sparqlChild.followedBy
    },
    {
        title: 'uses',
        value: sparqlChild.uses
    },
    {
        title: 'derivatesFrom',
        value: sparqlChild.derivatesFrom
    }
]

module.exports = {
    endpointUrl,
    sparqlParents,
    sparqlChildren
};