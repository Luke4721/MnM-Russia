const fs = require('fs');
let html = fs.readFileSync('E:/MnM_Travel_Russian/index.html', 'utf8');
const images = html.match(/images\/[^\"]+/g) || [];
console.log(Array.from(new Set(images)).join('\n'));
