const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    if (req.method === 'POST' && req.url === '/save-channels') {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const channels = JSON.parse(body);
                const jsonContent = JSON.stringify(channels, null, 2);
                
                // Save to root folder
                fs.writeFileSync('selected-channels.json', jsonContent);
                
                // Save to public folder
                fs.writeFileSync(path.join('public', 'selected-channels.json'), jsonContent);
                
                console.log(`✅ Saved ${channels.length} channels to both files`);
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: true, 
                    message: `Saved ${channels.length} channels`,
                    count: channels.length
                }));
            } catch (error) {
                console.error('❌ Error:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: error.message }));
            }
        });
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log('');
    console.log('════════════════════════════════════════');
    console.log('  📡 Channel Auto-Save Server Running');
    console.log('════════════════════════════════════════');
    console.log(`  Port: ${PORT}`);
    console.log('  Status: Ready to receive channels');
    console.log('  Keep this running while selecting channels');
    console.log('════════════════════════════════════════');
    console.log('');
});
