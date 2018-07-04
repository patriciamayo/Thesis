const rp = require('request-promise');
const cheerio = require('cheerio');
const wikiSection = require('../models/wikiSection')

const options = {
  uri: 'https://en.wikipedia.org/wiki/Ball',
  transform: function (body) {
    return cheerio.load(body);
  }
};

var getWikipedia = () => {
    console.log("making rp call")
    rp(options)
        .then(($) => {
            console.log('answer back!!')
            var test = $('div[class=toc]').html()
            var sections = []
            $('div[class=toc]').find('a').each(function(i, elem) {
                sections.push(new wikiSection($(this).attr('href'), $(this).children().filter('.toctext').text(),  $(this).children().filter('.tocnumber').text()))
            });
            console.log(sections);
        })
        .catch((err) => {
            console.log("erroooor " + err);
    });
}

module.exports = {
    getWikipedia
}