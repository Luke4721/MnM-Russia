const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('E:/MnM_Travel_Russian/index.html', 'utf8');
const $ = cheerio.load(html);

$('body').children().each((i, el) => {
    console.log($(el).prop('tagName'), $(el).attr('class'));
});
