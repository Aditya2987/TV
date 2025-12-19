// IPTV Player Application
let channels = [];
let filteredChannels = [];
let currentChannel = null;
let hls = null;

// Popular IPTV playlist URLs from iptv-org
const PLAYLIST_URLS = {
    'Global': 'https://iptv-org.github.io/iptv/index.m3u',
    'USA': 'https://iptv-org.github.io/iptv/countries/us.m3u',
    'UK': 'https://iptv-org.github.io/iptv/countries/uk.m3u',
    'India': 'https://iptv-org.github.io/iptv/countries/in.m3u',
    'Canada': 'https://iptv-org.github.io/iptv/countries/ca.m3u',
    'Australia': 'https://iptv-org.github.io/iptv/countries/au.m3u',
    'Germany': 'https://iptv-org.github.io/iptv/countries/de.m3u',
    'France': 'https://iptv-org.github.io/iptv/countries/fr.m3u',
    'Spain': 'https://iptv-org.github.io/iptv/countries/es.m3u',
    'Italy': 'https://iptv-org.github.io/iptv/countries/it.m3u',
    'Brazil': 'https://iptv-org.github.io/iptv/countries/br.m3u',
    'Japan': 'https://iptv-org.github.io/iptv/countries/jp.m3u',
    'South Korea': 'https://iptv-org.github.io/iptv/countries/kr.m3u',
    'Mexico': 'https://iptv-org.github.io/iptv/countries/mx.m3u',
    'Russia': 'https://iptv-org.github.io/iptv/countries/ru.m3u'
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeUI();
    populateCountrySelector();
    loadDefaultPlaylist();
    setupEventListeners();
});

// Initialize UI elements
function initializeUI() {
    const video = document.getElementById('videoPlayer');
    video.style.display = 'none';
}

// Populate country selector
function populateCountrySelector() {
    const select = document.getElementById('countrySelect');
    select.innerHTML = '';
    
    Object.keys(PLAYLIST_URLS).forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        select.appendChild(option);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Country selector
    document.getElementById('countrySelect').addEventListener('change', (e) => {
        loadPlaylist(e.target.value);
    });

    // Search functionality
    document.getElementById('searchInput').addEventListener('input', (e) => {
        filterChannels(e.target.value);
    });

    // Category filter
    document.getElementById('categoryFilter').addEventListener('change', (e) => {
        filterByCategory(e.target.value);
    });

    // Reload button
    document.getElementById('reloadBtn').addEventListener('click', () => {
        if (currentChannel) {
            playChannel(currentChannel);
        }
    });

    // Fullscreen button
    document.getElementById('fullscreenBtn').addEventListener('click', () => {
        toggleFullscreen();
    });
}

// Load default playlist
function loadDefaultPlaylist() {
    loadPlaylist('Global');
}

// Load playlist from URL
async function loadPlaylist(country) {
    const channelList = document.getElementById('channelList');
    channelList.innerHTML = '<div class="loading">Loading channels...</div>';

    console.log('🔄 Loading playlist for:', country);

    try {
        const url = PLAYLIST_URLS[country];
        console.log('📡 Fetching from URL:', url);
        
        const response = await fetch(url);
        console.log('📥 Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = await response.text();
        console.log('📄 Received text length:', text.length);
        
        channels = parseM3U(text);
        console.log('📺 Parsed channels:', channels.length);
        
        filteredChannels = [...channels];
        
        if (channels.length === 0) {
            console.warn('⚠️ No channels found in playlist');
            channelList.innerHTML = '<div class="error-message">No channels found in this playlist.</div>';
            return;
        }
        
        displayChannels(filteredChannels);
        populateCategories();
        
    } catch (error) {
        console.error('❌ Error loading playlist:', error);
        console.error('Error details:', error.message);
        channelList.innerHTML = '<div class="error-message">Failed to load channels. Error: ' + error.message + '</div>';
    }
}

// Parse M3U playlist
function parseM3U(text) {
    const lines = text.split('\n');
    const channels = [];
    let currentChannel = {};

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line.startsWith('#EXTINF:')) {
            // Parse channel info
            const info = line.substring(8);
            
            // Extract channel name (after the last comma)
            const nameMatch = info.match(/,(.+)$/);
            currentChannel.name = nameMatch ? nameMatch[1].trim() : 'Unknown Channel';
            
            // Extract attributes
            const tvgIdMatch = info.match(/tvg-id="([^"]*)"/);
            const tvgNameMatch = info.match(/tvg-name="([^"]*)"/);
            const tvgLogoMatch = info.match(/tvg-logo="([^"]*)"/);
            const groupTitleMatch = info.match(/group-title="([^"]*)"/);
            
            currentChannel.tvgId = tvgIdMatch ? tvgIdMatch[1] : '';
            currentChannel.tvgName = tvgNameMatch ? tvgNameMatch[1] : currentChannel.name;
            currentChannel.logo = tvgLogoMatch ? tvgLogoMatch[1] : '';
            currentChannel.category = groupTitleMatch ? groupTitleMatch[1] : 'Uncategorized';
            
        } else if (line && !line.startsWith('#')) {
            // This is the stream URL
            currentChannel.url = line;
            channels.push({ ...currentChannel });
            currentChannel = {};
        }
    }

    return channels;
}

// Display channels in the list
function displayChannels(channelList) {
    const container = document.getElementById('channelList');
    
    if (channelList.length === 0) {
        container.innerHTML = '<div class="loading">No channels found.</div>';
        return;
    }

    container.innerHTML = '';
    const selectedChannels = getSelectedChannels();
    
    channelList.forEach((channel, index) => {
        const channelItem = document.createElement('div');
        channelItem.className = 'channel-item';
        
        const isSelected = selectedChannels.some(ch => ch.url === channel.url);
        const isHttps = channel.url.startsWith('https://');
        
        // Add indicator for HTTP channels
        const protocolBadge = isHttps ? 
            '<span style="color: #4CAF50; font-size: 10px;">🔒 HTTPS</span>' : 
            '<span style="color: #FF9800; font-size: 10px;">⚠️ HTTP (local only)</span>';
        
        channelItem.innerHTML = `
            <div class="channel-content">
                <div class="channel-info-wrapper">
                    <div class="channel-name">${escapeHtml(channel.name)} ${protocolBadge}</div>
                    <div class="channel-meta">${escapeHtml(channel.category)}</div>
                </div>
                <button class="select-btn ${isSelected ? 'selected' : ''}" data-index="${index}">
                    ${isSelected ? '✓' : '+'}
                </button>
            </div>
        `;
        
        // Play channel on click (but not on button)
        const channelContent = channelItem.querySelector('.channel-info-wrapper');
        channelContent.addEventListener('click', () => {
            playChannel(channel);
            // Update active state
            document.querySelectorAll('.channel-item').forEach(item => {
                item.classList.remove('active');
            });
            channelItem.classList.add('active');
        });
        
        // Select/deselect channel
        const selectBtn = channelItem.querySelector('.select-btn');
        selectBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleChannelSelection(channel, selectBtn);
        });
        
        container.appendChild(channelItem);
    });
}

// Get selected channels from localStorage and Firebase
function getSelectedChannels() {
    const stored = localStorage.getItem('selectedChannels');
    return stored ? JSON.parse(stored) : [];
}

// Save selected channels to localStorage and auto-save to files
function saveSelectedChannels(channels) {
    console.log('Saving channels:', channels.length);
    
    // Save to localStorage (for local access)
    localStorage.setItem('selectedChannels', JSON.stringify(channels));
    console.log('✅ Saved to localStorage successfully');
    
    // Auto-save to files via server
    fetch('http://localhost:3000/save-channels', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(channels)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log(`✅ AUTO-SAVED: ${data.count} channels saved to files!`);
            console.log('✅ Ready to deploy! Just run: deploy.bat');
        } else {
            console.error('❌ Auto-save failed:', data.error);
            showManualInstructions(channels);
        }
    })
    .catch(error => {
        console.warn('⚠️ Auto-save server not running');
        console.log('💡 Start server with: node save-server.js');
        console.log('   Then refresh and select channels again');
        showManualInstructions(channels);
    });
}

// Show manual copy instructions if auto-save fails
function showManualInstructions(channels) {
    const jsonOutput = JSON.stringify(channels, null, 2);
    console.log('\n📋 ═══════════════════════════════════════════════════');
    console.log('📋 MANUAL MODE - COPY THIS TO selected-channels.json:');
    console.log('📋 ═══════════════════════════════════════════════════');
    console.log(jsonOutput);
    console.log('📋 ═══════════════════════════════════════════════════\n');
}

// Toggle channel selection
function toggleChannelSelection(channel, button) {
    console.log('Toggling selection for:', channel.name);
    let selectedChannels = getSelectedChannels();
    const existingIndex = selectedChannels.findIndex(ch => ch.url === channel.url);
    
    if (existingIndex >= 0) {
        // Remove from selection
        console.log('Removing channel from selection');
        selectedChannels.splice(existingIndex, 1);
        button.textContent = '+';
        button.classList.remove('selected');
    } else {
        // Add to selection
        console.log('Adding channel to selection');
        selectedChannels.push(channel);
        button.textContent = '✓';
        button.classList.add('selected');
    }
    
    saveSelectedChannels(selectedChannels);
    console.log('Total selected channels:', selectedChannels.length);
}

// Play selected channel
function playChannel(channel) {
    currentChannel = channel;
    const video = document.getElementById('videoPlayer');
    const welcomeScreen = document.getElementById('welcomeScreen');
    const channelName = document.getElementById('currentChannelName');
    const channelInfo = document.getElementById('currentChannelInfo');

    // Hide welcome screen
    welcomeScreen.classList.add('hidden');
    video.style.display = 'block';

    // Update info
    channelName.textContent = channel.name;
    channelInfo.textContent = `Category: ${channel.category}`;

    // Stop previous stream
    if (hls) {
        hls.destroy();
        hls = null;
    }

    // Play new stream
    if (Hls.isSupported()) {
        hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
        });
        
        hls.loadSource(channel.url);
        hls.attachMedia(video);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play().catch(e => {
                console.error('Playback error:', e);
                alert('Failed to play channel. The stream might be unavailable.');
            });
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
            console.error('HLS Error:', data);
            if (data.fatal) {
                switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        console.error('Network error');
                        hls.startLoad();
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        console.error('Media error');
                        hls.recoverMediaError();
                        break;
                    default:
                        console.error('Fatal error, destroying HLS');
                        hls.destroy();
                        break;
                }
            }
        });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (Safari)
        video.src = channel.url;
        video.addEventListener('loadedmetadata', () => {
            video.play().catch(e => {
                console.error('Playback error:', e);
                alert('Failed to play channel. The stream might be unavailable.');
            });
        });
    } else {
        alert('Your browser does not support HLS streaming.');
    }
}

// Filter channels by search term
function filterChannels(searchTerm) {
    const term = searchTerm.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    
    filteredChannels = channels.filter(channel => {
        const matchesSearch = channel.name.toLowerCase().includes(term) || 
                            channel.category.toLowerCase().includes(term);
        const matchesCategory = categoryFilter === 'all' || channel.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });
    
    displayChannels(filteredChannels);
}

// Filter by category
function filterByCategory(category) {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    filteredChannels = channels.filter(channel => {
        const matchesSearch = channel.name.toLowerCase().includes(searchTerm) || 
                            channel.category.toLowerCase().includes(searchTerm);
        const matchesCategory = category === 'all' || channel.category === category;
        return matchesSearch && matchesCategory;
    });
    
    displayChannels(filteredChannels);
}

// Populate categories dropdown
function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    const categories = new Set(channels.map(ch => ch.category));
    
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    
    [...categories].sort().forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Toggle fullscreen
function toggleFullscreen() {
    const videoContainer = document.querySelector('.video-container');
    
    if (!document.fullscreenElement) {
        videoContainer.requestFullscreen().catch(err => {
            console.error('Error attempting to enable fullscreen:', err);
        });
    } else {
        document.exitFullscreen();
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
