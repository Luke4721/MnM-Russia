const cheerio = require('cheerio');
const fs = require('fs');

const html = fs.readFileSync('vita_clone/index.html', 'utf8');
const $ = cheerio.load(html);

// Load packages
const packages = require('E:/MNM_Website/new_packages.json');

// Find the template
const featuredItemsContainer = $('.featured__items');
const template = featuredItemsContainer.find('.featured-item').first().clone();

// Empty the container
featuredItemsContainer.empty();

// Generate packages
packages.forEach(pkg => {
    const el = template.clone();
    
    // Set title
    el.find('.featured-item__head .h4').text(pkg.title);
    
    // Set price
    el.find('.featured-item__cost .body-lg-semibold').text(pkg.price);
    
    // Set images
    el.find('.featured-item__visual img').attr('src', pkg.image_url || pkg.img);
    el.find('.featured-item__visual img').attr('srcset', '');
    
    // Set properties
    const props = el.find('.featured-item-property .title-xs');
    if (props.length >= 1) $(props[0]).text(pkg.location || pkg.destination || 'India');
    if (props.length >= 2) $(props[1]).html(`${pkg.duration} <span class="color-white-60"></span>`);
    if (props.length >= 3) $(props[2]).text('Flexible Group Size');
    
    // Set button link
    el.find('.featured-item__button a').attr('href', `/package/${pkg.slug}`);
    
    featuredItemsContainer.append(el);
});

// Replace logos if found
$('img').each((i, el) => {
    const src = $(el).attr('src') || '';
    if (src.includes('logo')) {
        $(el).attr('src', '../images/mnmlogo.png');
        $(el).attr('srcset', '');
        $(el).css('filter', 'brightness(0) invert(1)'); // Vita is a dark theme, so invert logo
    }
});

// Save HTML
fs.writeFileSync('vita_clone/index.html', $.html());
console.log('Injection complete');
