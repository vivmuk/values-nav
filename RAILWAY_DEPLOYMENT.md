# Railway Deployment Guide for Values Navigator

This guide will walk you through deploying your Values Navigator app to Railway.

---

## Prerequisites

- A [Railway account](https://railway.app/) (sign up with GitHub for easy integration)
- Firebase already set up (see [FIREBASE_SETUP.md](FIREBASE_SETUP.md))
- Your Firebase configuration values from Firebase Console
- A Gemini API key (if using AI features)

---

## Step 1: Prepare Your Repository

1. Make sure all changes are committed to Git:
   ```bash
   git add .
   git commit -m "Prepare for Railway deployment"
   ```

2. Push to GitHub (if not already done):
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/values-navigator.git
   git branch -M main
   git push -u origin main
   ```

---

## Step 2: Create a New Railway Project

1. Go to [railway.app](https://railway.app/)
2. Click **"Start a New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub account (if first time)
5. Select your **Values Navigator** repository
6. Railway will automatically detect it's a Node.js/Vite project

---

## Step 3: Configure Environment Variables

This is **CRITICAL** - your app needs these environment variables to work:

1. In your Railway project dashboard, click on your service
2. Go to the **"Variables"** tab
3. Click **"+ New Variable"** and add each of these:

### Required Variables:

| Variable Name | Value | Where to Get It |
|--------------|-------|-----------------|
| `GEMINI_API_KEY` | Your Gemini API key | [Google AI Studio](https://aistudio.google.com/app/apikey) |
| `VITE_FIREBASE_API_KEY` | Your Firebase API key | Firebase Console > Project Settings > Web App Config |
| `VITE_FIREBASE_AUTH_DOMAIN` | `your-project.firebaseapp.com` | Firebase Console > Project Settings > Web App Config |
| `VITE_FIREBASE_PROJECT_ID` | Your Firebase Project ID | Firebase Console > Project Settings > Web App Config |
| `VITE_FIREBASE_STORAGE_BUCKET` | `your-project.appspot.com` | Firebase Console > Project Settings > Web App Config |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Your Messaging Sender ID | Firebase Console > Project Settings > Web App Config |
| `VITE_FIREBASE_APP_ID` | Your App ID | Firebase Console > Project Settings > Web App Config |

### How to Add Variables:

**Method 1: One by one**
- Click "+ New Variable"
- Enter variable name (e.g., `VITE_FIREBASE_API_KEY`)
- Enter variable value
- Click "Add"
- Repeat for all variables

**Method 2: Bulk import (RAW Editor)**
- Click "RAW Editor" in the Variables tab
- Paste all your variables in this format:
  ```
  GEMINI_API_KEY=your_actual_gemini_key
  VITE_FIREBASE_API_KEY=your_actual_firebase_api_key
  VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
  VITE_FIREBASE_PROJECT_ID=your-project-id
  VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
  VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
  VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
  ```
- Click "Update Variables"

---

## Step 4: Configure Build Settings (Auto-detected)

Railway should automatically detect the build settings from `railway.json`:

- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run preview`
- **Node Version**: 20 (from `.nvmrc` / `package.json#engines`)

If you need to verify or change these:
1. Go to **"Settings"** tab
2. Scroll to **"Deploy"** section
3. Check **Build Command** and **Start Command**

If Railway still builds with Node 18, set a Railway variable: `NIXPACKS_NODE_VERSION=20` and redeploy.

---

## Step 5: Deploy

1. Railway will automatically start deploying after you add the environment variables
2. Monitor the deployment in the **"Deployments"** tab
3. Click on the latest deployment to see build logs
4. Wait for "Success" status (usually takes 2-3 minutes)

---

## Step 6: Get Your Public URL

1. Go to the **"Settings"** tab
2. Scroll to **"Networking"** section
3. Click **"Generate Domain"**
4. Railway will give you a URL like: `https://your-app-name.up.railway.app`
5. Click the URL to open your deployed app

---

## Step 7: Test Your Deployment

1. Open your Railway URL in a browser
2. Navigate to **"The Compass"**
3. Create a values assessment
4. Click **"Commit to Daily Archive"**
5. Go to **"The Timeline"** - your assessment should appear
6. Verify in Firebase Console that data is being saved to Firestore

---

## Troubleshooting

### Build fails with "command not found"
- Check that `package.json` has the correct scripts
- Ensure `railway.json` has the correct build command

### App shows "Firebase: Error (auth/api-key-not-valid)"
- Double-check all Firebase environment variables in Railway
- Make sure there are no extra spaces or quotes
- Variable names must start with `VITE_` for Vite to expose them

### App loads but data doesn't save
- Check browser console for errors (F12)
- Verify Firebase environment variables are set correctly in Railway
- Ensure Firestore is enabled in Firebase Console
- Check Firestore security rules (should allow read/write in test mode)

### "Application failed to respond" error
- Check Railway logs for errors
- Ensure the start command is correct: `npm run preview`
- Ensure the app listens on Railway's `$PORT` (this repo configures Vite preview to bind to `$PORT` and `0.0.0.0`)
- Verify the app runs locally first with `npm run build && npm run preview`

### Changes not deploying
- Check the **"Deployments"** tab to see if deployment is triggered
- You may need to manually trigger a deployment: Settings > Service > Click "Deploy"
- Or push a new commit to GitHub

---

## Updating Your Deployment

Every time you push to your GitHub repository, Railway will automatically:
1. Pull the latest code
2. Rebuild the app
3. Deploy the new version

To manually trigger a deployment:
1. Go to Railway dashboard
2. Click on your service
3. Click **"Deploy"** button

---

## Environment Variables Best Practices

### Local Development
1. Create a `.env.local` file (already in `.gitignore`):
   ```bash
   cp .env.local.example .env.local
   ```

2. Fill in your actual values in `.env.local`

3. **NEVER** commit `.env.local` to Git

### Production (Railway)
- All environment variables are set in Railway dashboard
- They are encrypted and secure
- Never hardcode sensitive values in your code

---

## Custom Domain (Optional)

To use your own domain:

1. In Railway, go to **Settings** > **Networking**
2. Click **"Custom Domain"**
3. Enter your domain (e.g., `values-navigator.com`)
4. Follow the DNS configuration instructions
5. Add the CNAME record to your domain provider
6. Wait for DNS propagation (can take up to 48 hours)

---

## Monitoring and Logs

### View Deployment Logs
1. Go to **"Deployments"** tab
2. Click on any deployment
3. View build and runtime logs

### View Application Logs
1. Click on your service
2. Go to **"Observability"** tab
3. View real-time logs

### Metrics
- Railway provides CPU, Memory, and Network usage metrics
- Go to **"Metrics"** tab to monitor resource usage

---

## Cost Estimation

Railway pricing (as of 2025):
- **Free Tier**: $5 worth of usage per month
- **Pro Plan**: $20/month for more resources
- This app typically uses: ~$2-5/month (easily within free tier)

---

## Next Steps

1. ✅ Set up Firebase (see [FIREBASE_SETUP.md](FIREBASE_SETUP.md))
2. ✅ Deploy to Railway (you're here!)
3. Share your app URL with users
4. Monitor usage and data in Firebase Console
5. Consider adding authentication for private use
6. Set up proper Firestore security rules for production

---

## Support

- [Railway Documentation](https://docs.railway.app/)
- [Railway Community](https://discord.gg/railway)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

---

## Quick Reference Commands

```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy to Railway (automatic on git push)
git add .
git commit -m "Update app"
git push
```
