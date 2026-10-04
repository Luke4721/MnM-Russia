const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('e:/MnM_Travel_Russian/index.html', 'utf-8');
const $ = cheerio.load(html);
$('img').each((i, el) => {
    const src = $(el).attr('src');
    if (src && src.includes('unsplash')) console.log(src);
});
