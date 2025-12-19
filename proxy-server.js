const http = require('http');
const https = require('https');
const url = require('url');
const os = require('os');

const PORT = 8080;

// Get local IP address
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

const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // Get the target URL from query parameter
    const targetUrl = req.url.substring(1); // Remove leading /
    
    if (!targetUrl) {
        res.writeHead(400);
        res.end('Please provide a URL');
        return;
    }
    
    console.log('Proxying:', targetUrl);
    
    // Determine if target is HTTP or HTTPS
    const isHttps = targetUrl.startsWith('https://');
    const protocol = isHttps ? https : http;
    
    // Forward the request
    const proxyReq = protocol.get(targetUrl, (proxyRes) => {
        // Copy headers from target
        Object.keys(proxyRes.headers).forEach(key => {
            res.setHeader(key, proxyRes.headers[key]);
        });
        
        // Copy status code
        res.writeHead(proxyRes.statusCode);
        
        // Pipe the response
        proxyRes.pipe(res);
    });
    
    proxyReq.on('error', (error) => {
        console.error('Proxy error:', error.message);
        res.writeHead(500);
        res.end('Proxy error: ' + error.message);
    });
});

const localIP = getLocalIP();

server.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('════════════════════════════════════════════════════');
    console.log('  🌐 Channel Proxy Server Running');
    console.log('════════════════════════════════════════════════════');
    console.log(`  Local IP: ${localIP}:${PORT}`);
    console.log(`  Network URL: http://${localIP}:${PORT}`);
    console.log('');
    console.log('  📺 On your TV browser, the proxy will use:');
    console.log(`     http://${localIP}:${PORT}/[channel-url]`);
    console.log('');
    console.log('  ⚠️  Make sure:');
    console.log('     - TV and PC are on same WiFi network');
    console.log('     - Windows Firewall allows port 8080');
    console.log('     - Keep this window open while watching');
    console.log('════════════════════════════════════════');
    console.log('');
});
