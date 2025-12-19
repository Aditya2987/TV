// Simple TV Channel Player
let channels = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    loadSelectedChannels();
});

// Load selected channels from localStorage
function loadSelectedChannels() {
    const stored = localStorage.getItem('selectedChannels');
    channels = stored ? JSON.parse(stored) : [];
    displayChannels();
}

// Display channels in simple grid format
function displayChannels() {
    const container = document.getElementById('channelGrid');
    
    if (channels.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No channels available</p></div>';
        return;
    }

    container.innerHTML = '';
    
    channels.forEach((channel) => {
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
    });
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
            backBufferLength: 90
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
                switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        hls.startLoad();
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
        // Native HLS support (Safari)
        video.src = channel.url;
        video.play().catch(e => {
            console.error('Playback error:', e);
            alert('Failed to play channel. Please try another channel.');
            closePlayer();
        });
        
        // Request fullscreen
        if (playerDiv.requestFullscreen) {
            playerDiv.requestFullscreen().catch(err => console.log('Fullscreen request failed:', err));
        }
    } else {
        alert('Your browser does not support video streaming.');
        closePlayer();
    }
}

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
