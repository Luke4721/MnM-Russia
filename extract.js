const cheerio = require('cheerio');
const fs = require('fs');
const $ = cheerio.load(fs.readFileSync('vita_clone/index.html'));
fs.writeFileSync('item.txt', $('.featured-item').first().html());
