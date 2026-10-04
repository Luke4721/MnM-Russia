const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('e:/MnM_Travel_Russian/index.html', 'utf-8');
const $ = cheerio.load(html);
console.log($('.navbar').html() || $('.nav').html() || $('header').html() || 'not found');
