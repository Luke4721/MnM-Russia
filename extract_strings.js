const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('e:/MnM_Travel_Russian/index.html', 'utf-8');
const $ = cheerio.load(html);

const strings = new Set();
// Get text from standard tags
$('h1, h2, h3, h4, h5, h6, p, .body-xl, .body-lg, .body-md, .title-xs, .body-lg-semibold, .body-l, .title-sm').each((i, el) => {
    // Avoid child text duplication where possible
    const text = $(el).clone().children().remove().end().text().trim().replace(/\s+/g, ' ');
    if (text.length > 2 && !text.includes('₹') && !text.includes('₽')) {
        strings.add(text);
    }
});
// Also add text from elements that might have spans inside, just taking the full text if it's short
$('h1, h2, h3, h4, .body-xl, .body-lg, .body-md').each((i, el) => {
    const text = $(el).text().trim().replace(/\s+/g, ' ');
    if (text.length > 2 && text.length < 150 && !text.includes('₹')) {
        strings.add(text);
    }
});

fs.writeFileSync('e:/MnM_Travel_Russian/extracted_strings.json', JSON.stringify(Array.from(strings), null, 2));
console.log('Extracted ' + strings.size + ' strings');
