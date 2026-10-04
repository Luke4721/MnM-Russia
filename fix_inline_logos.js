const fs = require('fs');
const cheerio = require('cheerio');

function updateInlineLogos(filename) {
    if (!fs.existsSync(filename)) return;
    let text = fs.readFileSync(filename, 'utf-8');
    
    const $ = cheerio.load(text, { decodeEntities: false });
    
    // Replace the header inline SVG and text with the new logo image
    $('.header-logo').html('<img src="images/mnmlogo.svg" alt="Monks & Monkeys" style="height: 45px; width: auto;">');
    
    // Replace the footer inline SVG and text
    $('.footer-logo').html('<img src="images/mnmlogo.svg" alt="Monks & Monkeys" style="height: 60px; width: auto;">');

    // Remove any leftover header-logo__title if they were outside
    $('.header-logo__title').remove();
    $('.footer-logo__title').remove();

    fs.writeFileSync(filename, $.html());
    console.log(`Updated inline logos in ${filename}`);
}

updateInlineLogos('e:/MnM_Travel_Russian/index.html');
updateInlineLogos('e:/MnM_Travel_Russian/packages.html');
updateInlineLogos('e:/MnM_Travel_Russian/gallery.html');
updateInlineLogos('e:/MnM_Travel_Russian/about.html');
updateInlineLogos('e:/MnM_Travel_Russian/blog.html');
updateInlineLogos('e:/MnM_Travel_Russian/contact.html');
