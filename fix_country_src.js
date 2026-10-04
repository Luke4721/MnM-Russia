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
  '1507525428034-b723cf961d3e'
];
let idIndex = 0;

function processFile(filename) {
    if (!fs.existsSync(filename)) return;
    let text = fs.readFileSync(filename, 'utf-8');
    
    // Some generated packages have `src="Singapore"` instead of a proper URL
    // We will use regex to find `src="SomeCountry"` and replace it
    const badSrcRegex = /src="([A-Z][a-zA-Z\s]+)"/g;
    
    text = text.replace(badSrcRegex, (match, p1) => {
        // Exclude some legitimate ones if any, but in our case, Country names are capitalized words
        if (p1 === "Singapore" || p1 === "Malaysia" || p1 === "France" || p1 === "Spain" || 
            p1 === "Indonesia" || p1 === "Kazakhstan" || p1 === "Azerbaijan" || p1 === "Uzbekistan" || 
            p1 === "Bhutan" || p1 === "Japan" || p1 === "Russia" || p1 === "Armenia" || 
            p1 === "Portugal" || p1 === "Kyrgyzstan" || p1 === "Tajikistan") {
            const nextId = validIds[idIndex % validIds.length];
            idIndex++;
            return `src="https://images.unsplash.com/photo-${nextId}?q=80&w=800&auto=format&fit=crop"`;
        }
        return match;
    });

    fs.writeFileSync(filename, text);
    console.log(`Patched country names to images in ${filename}`);
}

processFile('e:/MnM_Travel_Russian/index.html');
processFile('e:/MnM_Travel_Russian/packages.html');
