# Firebase Deployment Instructions

## 📋 Prerequisites

1. **Node.js** installed (if not, download from https://nodejs.org/)
2. **Firebase account** (free) - Sign up at https://firebase.google.com/

## 🚀 Steps to Deploy

### 1. Install Firebase CLI

Open PowerShell/Command Prompt and run:
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase

```bash
firebase login
```
This will open your browser - login with your Google account.

### 3. Create Firebase Project

Go to https://console.firebase.google.com/ and:
- Click "Add project"
- Enter a project name (e.g., "tv-channels")
- Disable Google Analytics (not needed)
- Click "Create project"

### 4. Initialize Firebase in Your Project

Navigate to your project folder:
```bash
cd "d:\Sem 6 Project\TV Channels"
```

Link to your Firebase project:
```bash
firebase init hosting
```

When prompted:
- **Use existing project?** → YES
- **Select your project** → Choose the project you just created
- **Public directory?** → Type `public` and press Enter
- **Single-page app?** → YES
- **Overwrite index.html?** → NO

### 5. Deploy to Firebase

```bash
firebase deploy
```

### 6. Your Site is Live! 🎉

After deployment, Firebase will show you the URL like:
```
https://your-project-name.web.app
```

## 📱 Usage Instructions for Your Mother

1. First, use the main `index.html` on your computer to:
   - Browse channels
   - Click the "+" button to select favorite channels
   
2. The selected channels are saved in the browser

3. Then open the Firebase URL on TV browser to watch the selected channels

## 🔄 Update Deployment

Whenever you make changes:
```bash
cd "d:\Sem 6 Project\TV Channels"
firebase deploy
```

## ⚠️ Important Notes

- The TV needs to access the same browser data where channels were selected
- Alternatively, you can manually add channels by editing the JavaScript file
- Or create an admin panel to manage channels remotely

## 🔧 Alternative: Add Channels Directly in Code

If you want specific channels to always appear, edit `public/favorites.js` and add:

```javascript
// Load selected channels from localStorage
function loadSelectedChannels() {
    // If no channels in localStorage, use these default channels
    const defaultChannels = [
        {
            name: "Channel 1",
            logo: "https://example.com/logo1.png",
            url: "https://stream-url-1.m3u8",
            category: "News"
        },
        {
            name: "Channel 2", 
            logo: "https://example.com/logo2.png",
            url: "https://stream-url-2.m3u8",
            category: "Entertainment"
        }
    ];
    
    const stored = localStorage.getItem('selectedChannels');
    channels = stored ? JSON.parse(stored) : defaultChannels;
    displayChannels();
}
```

Then deploy again with `firebase deploy`.
