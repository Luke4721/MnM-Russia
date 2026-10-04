const fs = require('fs');

const validIds = [
  '1510798831971-661eb04b3739',
  '1582719362874-f2a898dfd7cb',
  '1493246507139-91e8fad9978e',
  '1540541338-8e79e6eb1f87',
  '1520250497591-112f2f40a3f4',
  '1571003123894-1f0594d2b5d9',
  '1566073771259-6a8506099945',
  '1499856871958-5b9627545d1a',
  '1518548419970-5871b5bb5d2b',
  '1538332576228-eb5b4c4d51b4',
  '1498307833015-e7b400441eb8',
  '1501785888041-af3ef285b470',
  '1506012787146-f92b2d7d6d96',
  '1476514525535-07fb3b4ae5f1',
  '1507525428034-b723cf961d3e',
  '1512453979798-5ea266f8880c',
  '1552465011-b4e21bf6e79a',
  '1544735716-392fe2489ffa',
  '1528127269322-539801943592',
  '1502602812047-d7585f1c5092'
];

let idIndex = 0;

function replaceUnsplash(text) {
  return text.replace(/https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9\-]+/g, (match) => {
    // We replace the ID part
    const nextId = validIds[idIndex % validIds.length];
    idIndex++;
    return `https://images.unsplash.com/photo-${nextId}`;
  });
}

function processFile(filename) {
    if (!fs.existsSync(filename)) return;
    let text = fs.readFileSync(filename, 'utf-8');
    text = replaceUnsplash(text);
    
    // As per user instructions: "take their logo from mnmtravels.com and make it their site in terms of text and data about the company"
    // Currently the logo is locally `images/mnmlogo.png` or `../images/mnmlogo.png`. If it's missing, let's ensure it's explicitly loaded, 
    // or we use the actual mnmtravels.com live logo URL if the local one is broken.
    // The user said: "take their logo from mnmtravels.com"
    // I will replace local mnmlogo.png with https://mnmtravels.com/images/mnmlogo.png
    text = text.replace(/images\/mnmlogo\.png/g, 'https://mnmtravels.com/images/mnmlogo.png');
    text = text.replace(/\.\.\/images\/mnmlogo\.png/g, 'https://mnmtravels.com/images/mnmlogo.png');

    fs.writeFileSync(filename, text);
    console.log(`Patched ${filename}`);
}

processFile('e:/MnM_Travel_Russian/index.html');
processFile('e:/MnM_Travel_Russian/packages.html');
processFile('e:/MnM_Travel_Russian/js/enhancements.js');

