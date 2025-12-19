const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = process.env.PORT || 3001;

// Get local IP
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.m3u8': 'application/vnd.apple.mpegurl',
    '.ts': 'video/mp2t'
};

const server = http.createServer((req, res) => {
    console.log('Request:', req.url);
    
    // Default to index.html
    let filePath = './public' + (req.url === '/' ? '/index.html' : req.url);
    
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code == 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 Internal Server Error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Cache-Control': 'no-cache'
            });
            res.end(content, 'utf-8');
        }
    });
});

const localIP = getLocalIP();

server.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('════════════════════════════════════════════════════');
    console.log('  📺 TV Channels Server Running');
    console.log('════════════════════════════════════════════════════');
    console.log('');
    console.log(`  Port: ${PORT}`);
    if (process.env.RENDER) {
        console.log('  🌐 Deployed on Render.com');
        console.log('  ✅ Access from anywhere!');
    } else {
        console.log(`  🌐 Local URL: http://${localIP}:${PORT}`);
        console.log('  ⚠️  Keep this window open while watching');
    }
    console.log('');
    console.log('  ✅ All channels (HTTP & HTTPS) will work!');
    console.log('════════════════════════════════════════════════════');
    console.log('');
});
