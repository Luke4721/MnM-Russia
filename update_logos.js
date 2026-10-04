const fs = require('fs');
const cheerio = require('cheerio');

function updateHtml(filename) {
    if (!fs.existsSync(filename)) return;
    let text = fs.readFileSync(filename, 'utf-8');
    
    // Replace logo PNG with SVG
    text = text.replace(/https:\/\/mnmtravels\.com\/images\/mnmlogo\.png/g, 'images/mnmlogo.svg');
    text = text.replace(/images\/mnmlogo\.png/g, 'images/mnmlogo.svg');
    text = text.replace(/\.\.\/images\/mnmlogo\.png/g, 'images/mnmlogo.svg');
    
    // Replace favicon (assumed standard patterns)
    text = text.replace(/href="[^"]*favicon[^"]*"/g, 'href="images/mnmlogo.svg"');
    
    // Also inject a specific link if not present just to be sure
    if (!text.includes('rel="icon"')) {
        text = text.replace(/<\/head>/, '  <link href="images/mnmlogo.svg" rel="icon" type="image/svg+xml">\n</head>');
    } else {
        // If there's an existing link rel="icon" or "shortcut icon", let's aggressively replace it using cheerio
        const $ = cheerio.load(text, { decodeEntities: false });
        $('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]').attr('href', 'images/mnmlogo.svg');
        // also replace any logo images
        $('.brand img').attr('src', 'images/mnmlogo.svg');
        $('.footer-brand img').attr('src', 'images/mnmlogo.svg');
        
        text = $.html();
    }
    
    fs.writeFileSync(filename, text);
    console.log(`Updated logos in ${filename}`);
}

updateHtml('e:/MnM_Travel_Russian/index.html');
updateHtml('e:/MnM_Travel_Russian/packages.html');
updateHtml('e:/MnM_Travel_Russian/gallery.html');
updateHtml('e:/MnM_Travel_Russian/about.html');
updateHtml('e:/MnM_Travel_Russian/blog.html');
updateHtml('e:/MnM_Travel_Russian/contact.html');
