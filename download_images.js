const fs = require('fs');
const https = require('https');
const cheerio = require('cheerio');
const path = require('path');

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

const imgDir = 'e:/MnM_Travel_Russian/images/packages';
if (!fs.existsSync(imgDir)) {
    fs.mkdirSync(imgDir, { recursive: true });
}

function downloadImage(id, dest) {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(dest)) return resolve();
        
        const url = `https://images.unsplash.com/photo-${id}?q=80&w=800&auto=format&fit=crop`;
        const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                // handle redirect
                https.get(res.headers.location, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res2) => {
                    const file = fs.createWriteStream(dest);
                    res2.pipe(file);
                    file.on('finish', () => { file.close(); resolve(); });
                });
            } else if (res.statusCode === 200) {
                const file = fs.createWriteStream(dest);
                res.pipe(file);
                file.on('finish', () => { file.close(); resolve(); });
            } else {
                console.log(`Failed to download ${id}: ${res.statusCode}`);
                // Create a dummy image or copy an existing one so it's not broken
                fs.copyFileSync('e:/MnM_Travel_Russian/images/d0d74fa518ccf2c3f270d33d480a52ec.jpg', dest);
                resolve();
            }
        }).on('error', (err) => {
            fs.copyFileSync('e:/MnM_Travel_Russian/images/d0d74fa518ccf2c3f270d33d480a52ec.jpg', dest);
            resolve();
        });
    });
}

async function run() {
    console.log('Downloading images locally...');
    for (let i = 0; i < validIds.length; i++) {
        await downloadImage(validIds[i], `${imgDir}/${i}.jpg`);
    }
    
    // Replace all unsplash links in HTML with local links
    function fixHtml(filename) {
        if (!fs.existsSync(filename)) return;
        let text = fs.readFileSync(filename, 'utf-8');
        
        validIds.forEach((id, index) => {
            // Replace both encoded and non-encoded query params
            const regex = new RegExp(`https:\\/\\/images\\.unsplash\\.com\\/photo-${id}[^"\\s]*`, 'g');
            text = text.replace(regex, `images/packages/${index}.jpg`);
        });
        
        // Catch any remaining unsplash links and point them to a default
        text = text.replace(/https:\/\/images\.unsplash\.com\/photo-[^"\\s]*/g, 'images/packages/0.jpg');

        fs.writeFileSync(filename, text);
        console.log(`Replaced Unsplash links in ${filename} with local images.`);
    }

    fixHtml('e:/MnM_Travel_Russian/index.html');
    fixHtml('e:/MnM_Travel_Russian/packages.html');
}

run();
