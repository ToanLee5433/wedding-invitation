
const fs = require('fs');
const https = require('https');

const url = 'https://iv1cdn.vnecdn.net/giaitri/images/web/2025/10/23/toan-canh-dam-cuoi-cua-vo-chong-do-thi-ha-1761191294.jpg?w=1200&q=100';
const path = 'public/wedding-bg.jpg';

const file = fs.createWriteStream(path);
https.get(url, {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
}, function (response) {
    response.pipe(file);
    file.on('finish', function () {
        file.close();
        console.log('Download completed');
    });
}).on('error', function (err) {
    fs.unlink(path, () => { });
    console.error('Error downloading image:', err.message);
});
