const fs = require('fs');
const cheerio = require('cheerio');

const toggleHTML = `
<div class="custom-locale-toggles">
  <button id="lang-toggle-en" class="locale-btn active" onclick="switchLanguage('en')">EN</button>
  <span class="locale-divider">|</span>
  <button id="lang-toggle-ru" class="locale-btn" onclick="switchLanguage('ru')">RU</button>
</div>
<div class="currency-toggles">
  <button id="curr-toggle-inr" class="locale-btn active" onclick="switchCurrency('inr')">₹ INR</button>
  <span class="locale-divider">|</span>
  <button id="curr-toggle-rub" class="locale-btn" onclick="switchCurrency('rub')">₽ RUB</button>
</div>
`;

function processFile(filename) {
    if (!fs.existsSync(filename)) return;
    const html = fs.readFileSync(filename, 'utf-8');
    const $ = cheerio.load(html, { decodeEntities: false });

    // 1. Add CSS
    if ($('link[href="css/enhancements.css"]').length === 0) {
        $('head').append('<link href="css/enhancements.css" rel="stylesheet" type="text/css">');
    }

    // 2. Add toggles in the header if not already added
    if ($('.custom-locale-toggles').length === 0) {
        $('.header__r').append(toggleHTML);
    }

    // 3. Add JS
    if ($('script[src="js/enhancements.js"]').length === 0) {
        $('body').append('<script src="js/enhancements.js"></script>');
    }

    fs.writeFileSync(filename, $.html());
    console.log(`Enhanced ${filename}`);
}

processFile('index.html');
processFile('packages.html');
processFile('gallery.html');
processFile('about.html');
processFile('blog.html');
processFile('contact.html');
