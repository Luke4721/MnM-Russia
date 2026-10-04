const fs = require('fs');

let html = fs.readFileSync('E:/MnM_Travel_Russian/index.html', 'utf8');

// Remove the weird floating background parts
html = html.replace(/<img[^>]*class="[^"]*intro-bg-part[^"]*"[^>]*>/g, '');

// Add CSS to hide the Webflow badge
const badgeCss = `
<style>
  .w-webflow-badge { display: none !important; }
</style>
`;
html = html.replace('</head>', badgeCss + '</head>');

fs.writeFileSync('E:/MnM_Travel_Russian/index.html', html);
console.log('Fixed intro-bg-part and webflow badge.');
