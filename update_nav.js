const fs = require('fs');
let html = fs.readFileSync('E:/MnM_Travel_Russian/index.html', 'utf8');

// The original navigation links in Vita look like this:
// <nav role="navigation" class="header-menu w-nav-menu">
//   <div class="header-menu__items">
//     <a href="/destinations" class="header-menu__item w-nav-link">Retreats</a>
//     <a href="/coaches" class="header-menu__item w-nav-link">Coaches</a>
//     <a href="/contacts" class="header-menu__item w-nav-link">Contacts</a>
//   </div>
// </nav>

// We need to replace it with our new nav items.
const newNavHTML = `
<nav role="navigation" class="header-menu w-nav-menu">
  <div class="header-menu__items">
    <a href="index.html" class="header-menu__item w-nav-link">Home</a>
    <a href="packages.html" class="header-menu__item w-nav-link">Destinations</a>
    <a href="gallery.html" class="header-menu__item w-nav-link">Gallery</a>
    <a href="about.html" class="header-menu__item w-nav-link">About</a>
    <a href="blog.html" class="header-menu__item w-nav-link">Blog</a>
    <a href="contact.html" class="header-menu__item w-nav-link">Contact</a>
  </div>
</nav>
`;

// Use regex to replace the old nav menu
html = html.replace(/<nav[^>]*class="[^"]*header-menu[^"]*"[^>]*>.*?<\/nav>/is, newNavHTML);

// Let's also remove the "Explore" button which is right next to it:
// <a data-wf--button-secondary--variant="header" href="/destinations" class="btn-secondary w-variant-8039e14a-f38b-d779-11ba-b2c347ad67ec w-inline-block"><div class="button-sm color-white">Explore</div>...</a>
// Wait, in Webflow there might be an "Explore" button inside `.header-right` or `.header-buttons`. Let's just find and remove it if it says "Explore".
html = html.replace(/<a[^>]*href="[^"]*"[^>]*btn-secondary[^>]*>.*?Explore.*?<\/a>/is, '');

fs.writeFileSync('E:/MnM_Travel_Russian/index.html', html);
console.log('Navigation updated in index.html');
