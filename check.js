const cheerio = require('cheerio');
const fs = require('fs');

const html = fs.readFileSync('vita_clone/index.html', 'utf8');
const $ = cheerio.load(html);

console.log($('.featured-item').length);
console.log($('.featured-item').first().parent().attr('class'));
