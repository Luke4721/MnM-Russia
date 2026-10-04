const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('e:/MnM_Travel_Russian/index.html', 'utf-8');
const $ = cheerio.load(html);
const srcs = new Set();
$('img').each((i, el) => srcs.add($(el).attr('src')));
console.log(Array.from(srcs).join('\n'));
