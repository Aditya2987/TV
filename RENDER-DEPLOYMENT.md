# TV Channels - Render.com Deployment

## 🚀 STEP-BY-STEP DEPLOYMENT TO RENDER.COM

### Step 1: Create GitHub Repository
1. Go to https://github.com
2. Click "New repository"
3. Name: `tv-channels`
4. Make it Public
5. Click "Create repository"

### Step 2: Upload Your Code to GitHub
Open terminal and run these commands:

```bash
cd "d:\Sem 6 Project\TV Channels"
git init
git add public/ tv-server.js package.json selected-channels.json
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/tv-channels.git
git push -u origin main
```

(Replace YOUR-USERNAME with your GitHub username)

### Step 3: Deploy to Render
1. Go to https://render.com
2. Sign up (free) - use GitHub to sign in
3. Click "New +" → "Web Service"
4. Click "Connect GitHub" → Select your `tv-channels` repository
5. Fill in:
   - **Name:** tv-channels (or anything you like)
   - **Environment:** Node
   - **Build Command:** (leave empty)
   - **Start Command:** `node tv-server.js`
   - **Plan:** Free
6. Click "Create Web Service"
7. Wait 2-3 minutes for deployment

### Step 4: Get Your URL
- After deployment, you'll see: `https://tv-channels-xxxx.onrender.com`
- **This is your permanent TV URL!**
- Works from anywhere, any device!

### Step 5: Watch on TV
1. Open your Render URL on TV browser
2. All channels work! 🎉

---

## 📝 UPDATING CHANNELS LATER

When you select new channels:

```bash
cd "d:\Sem 6 Project\TV Channels"
git add selected-channels.json
git commit -m "Updated channels"
git push
```

Render will auto-deploy the update! (takes 2-3 minutes)

---

## ⚠️ IMPORTANT NOTES

- Free tier sleeps after 15 min of inactivity
- First load after sleep takes ~30 seconds
- Upgrade to paid ($7/month) for always-on
- Your mother can bookmark the URL and use anytime!

---

## 🆘 TROUBLESHOOTING

**If GitHub push fails:**
Run: `git config --global user.email "your@email.com"`
Run: `git config --global user.name "Your Name"`
Try push again

**If Render deploy fails:**
Check that `package.json` and `tv-server.js` are committed
