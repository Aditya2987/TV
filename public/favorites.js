// Simple TV Channel Player
let channels = [];

// Default channels - Add your favorite channels here
const DEFAULT_CHANNELS = [
    {
        name: "Al Jazeera English",
        logo: "https://i.imgur.com/7bRVpnu.png",
        url: "https://live-hls-web-aje.getaj.net/AJE/index.m3u8",
        category: "News"
    },
    {
        name: "BBC News",
        logo: "https://i.imgur.com/REuN9RR.png",
        url: "https://vs-hls-push-ww-live.akamaized.net/x=3/i=urn:bbc:pips:service:bbc_news_channel_hd/t=3840/v=pv14/b=5070016/main.m3u8",
        category: "News"
    },
    {
        name: "NASA TV",
        logo: "https://i.imgur.com/WGGo4mU.png",
        url: "https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8",
        category: "Educational"
    },
    {
        name: "Red Bull TV",
        logo: "https://i.imgur.com/7kZSSEj.png",
        url: "https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8",
        category: "Sports"
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Favorites page loaded');
    updateStatus('Page loaded - Loading channels...');
    loadSelectedChannels();
});

// Update status display
function updateStatus(message) {
    const statusDiv = document.getElementById('statusInfo');
    if (statusDiv) {
        const time = new Date().toLocaleTimeString();
        const line = document.createElement('div');
        line.textContent = `[${time}] ${message}`;
        statusDiv.appendChild(line);
        
        // Keep only last 20 messages
        while (statusDiv.children.length > 20) {
            statusDiv.removeChild(statusDiv.firstChild);
        }
        
        // Scroll to bottom
        statusDiv.scrollTop = statusDiv.scrollHeight;
    }
    
    // Also log to console
    console.log(message);
}

// Load selected channels from static JSON file
function loadSelectedChannels() {
    console.log('📡 Loading channels from selected-channels.json...');
    updateStatus('🔄 Loading channels from file...');
    
    fetch('selected-channels.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('📦 Loaded data:', data);
            
            if (Array.isArray(data) && data.length > 0) {
                // If site is HTTPS, filter to only show HTTPS channels
                if (window.location.protocol === 'https:') {
                    const httpsChannels = data.filter(ch => ch.url.startsWith('https://'));
                    const httpCount = data.length - httpsChannels.length;
                    
                    if (httpCount > 0) {
                        console.log(`⚠️ Filtered out ${httpCount} HTTP channels (HTTPS site)`);
                        updateStatus(`⚠️ Showing ${httpsChannels.length} HTTPS channels only`);
                        updateStatus(`${httpCount} HTTP channels hidden (browser security)`);
                    }
                    
                    channels = httpsChannels;
                } else {
                    channels = data;
                }
                
                console.log('✅ Successfully loaded channels:', channels.length);
                updateStatus(`✅ Loaded ${channels.length} channels!`);
                
                if (channels.length === 0) {
                    updateStatus('⚠️ No HTTPS channels available');
                    updateStatus('💡 Select HTTPS channels or use local server');
                    channels = DEFAULT_CHANNELS.filter(ch => ch.url.startsWith('https://'));
                }
                
                displayChannels();
            } else {
                console.log('⚠️ No channels in JSON file, using defaults');
                updateStatus('⚠️ No channels found, using defaults');
                channels = DEFAULT_CHANNELS.filter(ch => ch.url.startsWith('https://'));
                displayChannels();
            }
        })
        .catch((error) => {
            console.error('❌ Error loading JSON:', error);
            updateStatus(`❌ Error: ${error.message}`);
            updateStatus('📺 Using default channels');
            channels = DEFAULT_CHANNELS.filter(ch => ch.url.startsWith('https://'));
            displayChannels();
        });
}

// Display channels in simple grid format
function displayChannels() {
    const container = document.getElementById('channelGrid');
    
    updateStatus(`displayChannels called with ${channels.length} channels`);
    console.log('Displaying channels:', channels);
    
    if (channels.length === 0) {
        updateStatus('❌ No channels to display');
        container.innerHTML = '<div class="empty-state"><p>No channels available</p></div>';
        return;
    }

    container.innerHTML = '';
    updateStatus(`Creating ${channels.length} channel boxes...`);
    
    channels.forEach((channel, index) => {
        try {
            const channelBox = document.createElement('div');
            channelBox.className = 'channel-box';
            
            // Create logo or placeholder
            let logoHtml = '';
            if (channel.logo && channel.logo.trim() !== '') {
                logoHtml = `<img src="${escapeHtml(channel.logo)}" alt="${escapeHtml(channel.name)}" class="channel-logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                           <div class="channel-logo-placeholder" style="display:none;">📺</div>`;
            } else {
                logoHtml = '<div class="channel-logo-placeholder">📺</div>';
            }
            
            channelBox.innerHTML = `
                ${logoHtml}
                <div class="channel-box-name">${escapeHtml(channel.name)}</div>
            `;
            
            // Play channel in fullscreen on click
            channelBox.addEventListener('click', () => {
                playChannelFullscreen(channel);
            });
            
            container.appendChild(channelBox);
        } catch (e) {
            console.error('Error creating channel box:', e, channel);
            updateStatus(`❌ Error with channel ${index}: ${e.message}`);
        }
    });
    
    updateStatus(`✅ Displayed ${channels.length} channels!`);
}

// Play channel in fullscreen
function playChannelFullscreen(channel) {
    // Create fullscreen video player
    const playerDiv = document.createElement('div');
    playerDiv.className = 'video-fullscreen';
    playerDiv.innerHTML = `
        <button class="video-close-btn">×</button>
        <video id="fullscreenVideo" controls autoplay></video>
    `;
    
    document.body.appendChild(playerDiv);
    
    const video = playerDiv.querySelector('#fullscreenVideo');
    const closeBtn = playerDiv.querySelector('.video-close-btn');
    
    // Close button handler
    const closePlayer = () => {
        if (window.currentHls) {
            window.currentHls.destroy();
            window.currentHls = null;
        }
        video.pause();
        playerDiv.remove();
    };
    
    closeBtn.addEventListener('click', closePlayer);
    
    // ESC key to close
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closePlayer();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
    
    // Start playing
    if (Hls.isSupported()) {
        const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90,
            xhrSetup: function(xhr, url) {
                xhr.withCredentials = false;
            }
        });
        
        window.currentHls = hls;
        
        hls.loadSource(channel.url);
        hls.attachMedia(video);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play().catch(e => {
                console.error('Playback error:', e);
                alert('Failed to play channel. Please try another channel.');
                closePlayer();
            });
            
            // Request fullscreen after video starts
            if (playerDiv.requestFullscreen) {
                playerDiv.requestFullscreen().catch(err => console.log('Fullscreen request failed:', err));
            } else if (video.webkitRequestFullscreen) {
                video.webkitRequestFullscreen();
            }
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
            console.error('HLS Error:', data);
            if (data.fatal) {
                let errorMsg = 'Cannot play this channel.';
                
                // Check if it's HTTP on HTTPS issue
                if (window.location.protocol === 'https:' && channel.url.startsWith('http://')) {
                    errorMsg = '❌ HTTP channels cannot play on HTTPS site.\n\n' +
                              '✅ SOLUTION:\n' +
                              '1. Run: start-tv-server.bat on your PC\n' +
                              '2. Open: http://192.168.1.5:3001 on TV\n' +
                              '3. All channels will work!\n\n' +
                              'Or select only HTTPS channels.';
                }
                
                switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        console.log('Network error, attempting retry...');
                        hls.startLoad();
                        setTimeout(() => {
                            if (!video.paused) return;
                            alert(errorMsg);
                            closePlayer();
                        }, 3000);
                switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        console.log('Network error, attempting retry...');
                        hls.startLoad();
                        setTimeout(() => {
                            if (!video.paused) return;
                            alert('Cannot play this channel. Please try another one.');
                            closePlayer();
                        }, 3000);
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        hls.recoverMediaError();
                        break;
                    default:
                        hls.destroy();
                        alert('Cannot play this channel. Please try another one.');
                        closePlayer();
                        break;
                }
            }
        });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}
