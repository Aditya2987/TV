# 📺 IPTV Web Player

A modern, user-friendly web application for watching TV channels from around the world using IPTV streams from the [iptv-org](https://github.com/iptv-org) repository.

## Features

- 🌍 **Multiple Countries**: Access TV channels from 15+ countries
- 🔍 **Search Functionality**: Quickly find your favorite channels
- 📂 **Category Filtering**: Browse channels by category (News, Sports, Entertainment, etc.)
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- 🎬 **Modern Video Player**: Smooth streaming with HLS.js support
- ⛶ **Fullscreen Mode**: Immersive viewing experience

## How to Use

### Option 1: Open Directly in Browser

1. Simply open the `index.html` file in your web browser
2. Select a country from the dropdown menu
3. Browse or search for channels
4. Click on any channel to start watching

### Option 2: Run with Local Server (Recommended)

For better CORS compatibility, use a local server:

**Using Python 3:**
```bash
python -m http.server 8000
```

**Using Node.js (http-server):**
```bash
npx http-server -p 8000
```

**Using VS Code:**
- Install the "Live Server" extension
- Right-click on `index.html` and select "Open with Live Server"

Then open your browser and navigate to:
```
http://localhost:8000
```

## Supported Countries

- 🌐 Global (All channels)
- 🇺🇸 USA
- 🇬🇧 UK
- 🇮🇳 India
- 🇨🇦 Canada
- 🇦🇺 Australia
- 🇩🇪 Germany
- 🇫🇷 France
- 🇪🇸 Spain
- 🇮🇹 Italy
- 🇧🇷 Brazil
- 🇯🇵 Japan
- 🇰🇷 South Korea
- 🇲🇽 Mexico
- 🇷🇺 Russia

## How It Works

1. **Playlist Loading**: The application fetches M3U playlist files from the iptv-org GitHub repository
2. **Parsing**: The M3U files are parsed to extract channel information (name, category, stream URL)
3. **Streaming**: HLS.js library handles the video streaming for compatibility across all modern browsers
4. **User Interface**: Clean, modern interface for easy navigation and channel selection

## Technical Details

### Technologies Used

- **HTML5**: Structure and video element
- **CSS3**: Modern, responsive styling
- **JavaScript (ES6+)**: Application logic and M3U parsing
- **HLS.js**: HTTP Live Streaming support for all browsers

### IPTV Sources

All streams are sourced from the community-maintained [iptv-org](https://github.com/iptv-org/iptv) repository, which provides:
- Free, legal IPTV channels
- Regular updates
- Multiple countries and categories
- M3U playlist format

## Browser Compatibility

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera
- ⚠️ Internet Explorer (Not supported)

## Troubleshooting

### Channel won't play
- The stream might be temporarily unavailable
- Try clicking the "🔄 Reload Stream" button
- Try a different channel
- Check your internet connection

### No channels loading
- Check your internet connection
- The iptv-org server might be temporarily down
- Try selecting a different country

### CORS Issues
- Run the application using a local web server (see "Option 2" above)
- Don't open the HTML file directly with file:// protocol

## Customization

### Adding More Countries

Edit the `PLAYLIST_URLS` object in `script.js`:

```javascript
const PLAYLIST_URLS = {
    'Your Country': 'https://iptv-org.github.io/iptv/countries/XX.m3u',
    // Add more countries here
};
```

Replace `XX` with the country code from [iptv-org countries list](https://github.com/iptv-org/iptv#playlists-by-country).

### Changing Theme Colors

Modify the gradient colors in `styles.css`:

```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

## Disclaimer

This application is for educational purposes. All streams are provided by third-party sources through the iptv-org repository. The availability and legality of streams depend on your location and the content providers. Please ensure you have the right to access the content in your region.

## Credits

- Stream sources: [iptv-org](https://github.com/iptv-org/iptv)
- Video player: [HLS.js](https://github.com/video-dev/hls.js/)

## License

This project is open source and available under the MIT License.

---

**Note**: Stream availability varies by region and time. Some channels may not work due to geo-restrictions or temporary outages.
