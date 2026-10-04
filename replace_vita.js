const fs = require('fs');
const path = require('path');

let html = fs.readFileSync('E:/MnM_Travel_Russian/index.html', 'utf8');

// Replace Texts
html = html.replace(/Vita Travels/g, 'MNM Travel');
html = html.replace(/Vita Travel/g, 'MNM Travel');
html = html.replace(/How Vita Works/g, 'How MNM Works');
html = html.replace(/behind Vita/g, 'behind MNM');
html = html.replace(/At Vita/g, 'At MNM');
html = html.replace(/vita-travels@gmail\.com/g, 'info@mnmtravel.com');

// Get available images from MNM
const mnmImagesDir = 'E:/MNM_Website/public/images';
let availableImages = fs.readdirSync(mnmImagesDir).filter(file => file.endsWith('.jpg') || file.endsWith('.webp') || file.endsWith('.jpeg'));

// Images to replace
const imagesToReplace = [
    '69b131f7e83fd36f79be5b78_bg-part-1.webp',
    '69b13422ebe5cda64625a488_mobile-bg-part-1.webp',
    '69b131f75b251dd705fc8bb9_bg-part-2.webp',
    '69b134223848489eddf4f3cf_mobile-bg-part-2.webp',
    '6971da641fb15bbf6432e993_statistic-1.webp',
    '6971da644ade29a121769faf_statistic-2.webp',
    '6971da64c60674c148d40058_statistic-3.webp',
    '6979a5eeee86150be7247f79_illustration-about.jpg',
    '698b68bbc6de4b51a55a64b3_destination-1.webp',
    '698b68bb48fceacc9f67c522_destination-2.webp',
    '698b68bb7277bdbc67c88cd3_destination-3.webp',
    '69897f6cc589808c226f0cd7_ea8e8b2e1274331d29db4f187ea3aebb_1.webp',
    '69897f6ccb670b10285a47bf_12.webp',
    '69897f6c6400b1ebc3956333_43c66f9116f860d81fe61e822e465e88_10.webp',
    '69897f6cb4387b1312d7ae14_9.webp',
    '697b6310adee6f369b84c520_illustration.webp'
];

let imgIndex = 0;
for (const targetImg of imagesToReplace) {
    if (availableImages.length === 0) break;
    
    // Pick an image
    const sourceImg = availableImages[imgIndex % availableImages.length];
    imgIndex++;
    
    // Copy the image over
    fs.copyFileSync(path.join(mnmImagesDir, sourceImg), path.join('E:/MnM_Travel_Russian/images', sourceImg));
    
    // Replace in HTML
    html = html.split(`images/${targetImg}`).join(`images/${sourceImg}`);
}

fs.writeFileSync('E:/MnM_Travel_Russian/index.html', html);
console.log('Replacements completed successfully.');
