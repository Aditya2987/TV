# Firebase Database Setup Guide

## 🔥 Step-by-Step Instructions

### 1. Create Firebase Project (if not done already)

1. Go to https://console.firebase.google.com/
2. Click "Add project" or select your existing project
3. Follow the setup wizard

### 2. Enable Realtime Database

1. In Firebase Console, go to **Build** > **Realtime Database**
2. Click **Create Database**
3. Choose location (closest to you)
4. **Start in test mode** (for now)
5. Click **Enable**

### 3. Set Database Rules (Important!)

In the **Rules** tab, replace the content with:

```json
{
  "rules": {
    "selectedChannels": {
      ".read": true,
      ".write": true
    }
  }
}
```

Click **Publish** to save the rules.

⚠️ **Note:** These rules allow anyone to read/write. For production, you should add authentication.

### 4. Get Your Firebase Config

1. In Firebase Console, click the ⚙️ icon > **Project settings**
2. Scroll down to "Your apps" section
3. Click the **Web** icon `</>` (or select existing web app)
4. Register app with a nickname (e.g., "TV Channels")
5. Copy the `firebaseConfig` object

### 5. Update firebase-config.js Files

Replace the values in BOTH files:
- `firebase-config.js` (root folder)
- `public/firebase-config.js`

Example:
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "my-tv-app.firebaseapp.com",
    databaseURL: "https://my-tv-app-default-rtdb.firebaseio.com",
    projectId: "my-tv-app",
    storageBucket: "my-tv-app.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456"
};
```

### 6. Test Locally

1. Open `index.html` in browser
2. Select some channels (click + button)
3. Check browser console - should see "Channels saved to Firebase"
4. Open `favorites.html` in browser
5. Should see your selected channels!

### 7. Deploy to Firebase

```bash
firebase deploy
```

### 8. Verify on TV

1. Open the deployed URL on your TV: `https://your-project.web.app`
2. Should show the channels you selected on your computer!

## 🔄 How It Works

1. **Select channels** on `index.html` (your computer)
2. Channels save to **Firebase Realtime Database**
3. **Favorites page** (on TV) loads channels from Firebase
4. Changes sync across all devices instantly!

## 🛠️ Troubleshooting

### Channels not syncing?

1. **Check Firebase Console**
   - Go to Realtime Database
   - Should see `selectedChannels` data

2. **Check Browser Console**
   - Press F12
   - Look for errors
   - Should see "Loaded channels from Firebase"

3. **Verify Config**
   - Make sure both `firebase-config.js` files have correct values
   - Check `databaseURL` is correct

4. **Check Database Rules**
   - Make sure read/write are set to `true`

### Still showing default channels?

- Clear browser cache
- Check if Firebase config is loaded (F12 console)
- Verify database rules allow public access

## 🔐 Security Note

Current setup allows anyone to read/write. For better security:

1. Add Firebase Authentication
2. Update database rules to require authentication
3. Only allow authenticated users to write

Would you like me to add authentication? Let me know!
