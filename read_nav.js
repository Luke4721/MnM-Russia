const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('E:/MnM_Travel_Russian/index.html', 'utf8');
const $ = cheerio.load(html);

console.log($('.header-nav').html());
console.log('---');
console.log($('.header__r').html());
