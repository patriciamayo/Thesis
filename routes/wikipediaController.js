const rp = require('request-promise');
const cheerio = require('cheerio');
const fetch = require("node-fetch");
const wikiSection = require('../models/wikiSection')



var getWikipedia = (url) => {
    return new Promise(function(resolve,reject){ 

        console.log(url)
        const options = {
            uri: url,
            transform: function (body) {
              return cheerio.load(body);
            }
        };

        rp(options).then(($) => {
            var sections = getTableOfContents($)
            var elements = []
            var currentElement = ""
            var currentSectionId = ""
            $('div[class=mw-parser-output]').children().each(function(i, elem) {

                // === If element is <p> append the content together ===

                if ($(this).get(0).tagName === 'p') {
                    currentElement += $(this).html() 

                // === If element is <h> we arrived to next section so we add the content to the previous section ===

                } else if ($(this).get(0).tagName === 'h2' || $(this).get(0).tagName === 'h3') {
                    var sectionFound = sections.find(function(item){
                        return item.id == '#' + currentSectionId;
                    });
                    if ( typeof sectionFound !== 'undefined' && sectionFound ) {
                        elements.push({
                            section: sectionFound,
                            content: getAllLinksFromHTMLText(currentElement)
                        })
                    }
                    // === Reset content to zero and update section reference ===

                    currentElement = ""
                    currentSectionId = $(this).find('span').attr('id')
                } 
            })
            resolve({
                wikidataID : getWikiDataID($),
                toc: elements
            })
        }).catch((err) => {
            console.log("Erroooor " + err);
            reject(err)
        });
    })
}

var getWikiDataID = ($) => {
    var linktoWikidata = $('#t-wikibase').find('a').attr('href') || ""
    return linktoWikidata.split('/').pop()
}

var getWikidataIDByQuery = (title) => {
    console.log("trying to call query " + title)
    const apiURL = "https://en.wikipedia.org/w/api.php?action=query&prop=pageprops&ppprop=wikibase_item&format=json&titles="
    console.log("calling url " + apiURL + title)
    return fetch( apiURL + title ).then( body => body.json() ).then( json => {
        console.log("answer arrived " + json)
        var pages = json.query.pages
        console.log(pages)
        console.log(Object.keys(pages))
        var pageKey = Object.keys(pages)[0]
        console.log(pageKey)
        console.log(pages[pageKey].pageprops.wikibase_item)
        return pages[pageKey].pageprops.wikibase_item
    });
}

var getTableOfContents = ($) => {
    var sections = []
    sections.push(new wikiSection('#', "Extract" , 0))
    $('div[class=toc]').find('a').each(function(i, elem) {
        sections.push(new wikiSection($(this).attr('href'), $(this).children().filter('.toctext').text(),  $(this).children().filter('.tocnumber').text()))
     })
    return sections
}

var getAllLinksFromHTMLText = (text) => {
    const $ = cheerio.load(text)
    var links = []
    $('a').each(function(i, elem)  {
        var title = $(this).attr('title') || $(this).text()
        var link = $(this).attr('href')
        // if title doesnt contain warning and link is not actually a citation
        if (title.indexOf('not exist') < 0 && link.indexOf('#cite') < 0) {
            links.push({
                link: 'https://en.wikipedia.org' + link,
                title: title
            })
        }
    })
    return links
}

module.exports = {
    getWikipedia,
    getWikidataIDByQuery
}