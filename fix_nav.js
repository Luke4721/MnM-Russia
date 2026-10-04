const fs = require('fs');
const cheerio = require('cheerio');

const files = [
    'index.html',
    'packages.html',
    'gallery.html',
    'about.html',
    'blog.html',
    'contact.html'
];

const newNavItems = `
<li data-anim-delay="0.1" data-anim="fade-down" class="header-nav__item"><a href="index.html" class="button-sm color-white header-nav__link">Home</a></li>
<li data-anim-delay="0.15" data-anim="fade-down" class="header-nav__item"><a href="packages.html" class="button-sm color-white header-nav__link">Destinations</a></li>
<li data-anim-delay="0.2" data-anim="fade-down" class="header-nav__item"><a href="gallery.html" class="button-sm color-white header-nav__link">Gallery</a></li>
<li data-anim-delay="0.25" data-anim="fade-down" class="header-nav__item"><a href="about.html" class="button-sm color-white header-nav__link">About</a></li>
<li data-anim-delay="0.3" data-anim="fade-down" class="header-nav__item"><a href="blog.html" class="button-sm color-white header-nav__link">Blog</a></li>
<li data-anim-delay="0.35" data-anim="fade-down" class="header-nav__item"><a href="contact.html" class="button-sm color-white header-nav__link">Contact</a></li>
`;

for (const file of files) {
    const filePath = 'E:/MnM_Travel_Russian/' + file;
    if (fs.existsSync(filePath)) {
        let html = fs.readFileSync(filePath, 'utf8');
        const $ = cheerio.load(html);
        
        // Update nav items
        $('.header-nav').html(newNavItems);
        
        // Remove Explore button in header
        $('.header__accent').remove();
        
        fs.writeFileSync(filePath, $.html());
        console.log('Updated nav in ' + file);
    }
}
