const rp = require('request-promise');
const cheerio = require('cheerio');
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
            console.log($);
        })
        .catch((err) => {
            console.log("erroooor " + err);
    });
}

module.exports = {
    getWikipedia
}