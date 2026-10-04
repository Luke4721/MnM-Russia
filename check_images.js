const fs = require('fs');
const http = require('http');
const https = require('https');
const cheerio = require('cheerio');

const html = fs.readFileSync('e:/MnM_Travel_Russian/index.html', 'utf-8');
const $ = cheerio.load(html);

const srcs = [];
$('img').each((i, el) => {
    const src = $(el).attr('src');
    if (src) srcs.push(src);
});

console.log(`Found ${srcs.length} images. Checking...`);

async function checkImage(src) {
    if (src.startsWith('data:')) return 'OK (data URI)';
    
    let url = src;
    if (!src.startsWith('http')) {
        url = `http://127.0.0.1:8080/${src.replace(/^\//, '')}`;
    }

    return new Promise((resolve) => {
        const reqLib = url.startsWith('https') ? https : http;
        reqLib.get(url, (res) => {
            if (res.statusCode >= 200 && res.statusCode < 400) {
                resolve('OK');
            } else {
                resolve(`FAIL (${res.statusCode})`);
            }
        }).on('error', (e) => {
            resolve(`ERROR (${e.message})`);
        });
    });
}

async function run() {
    for (let src of srcs) {
        const status = await checkImage(src);
        if (status !== 'OK') {
            console.log(`Broken: ${src} - ${status}`);
        }
    }
    console.log('Done.');
}
run();
