# Quick Start Guide - Values Navigator

Get your Values Navigator app up and running in minutes!

---

## 🚀 5-Minute Local Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
```bash
# Copy the example file
cp .env.local.example .env.local
```

Then edit `.env.local` and add:
- **Gemini API Key**: Get from [Google AI Studio](https://aistudio.google.com/app/apikey)
- **Firebase Config**: Follow [FIREBASE_SETUP.md](FIREBASE_SETUP.md) (10 minutes)

### 3. Run the App
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📋 Complete Setup Checklist

- [ ] Clone/download the repository
- [ ] Run `npm install`
- [ ] Create `.env.local` from `.env.local.example`
- [ ] Get Gemini API key from Google AI Studio
- [ ] **Set up Firebase** (see [FIREBASE_SETUP.md](FIREBASE_SETUP.md))
  - [ ] Create Firebase project
  - [ ] Enable Cloud Firestore
  - [ ] Get Firebase config
  - [ ] Add Firebase variables to `.env.local`
- [ ] Run `npm run dev`
- [ ] Test the app locally
- [ ] **Deploy to Railway** (see [RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md))
  - [ ] Create Railway account
  - [ ] Connect GitHub repository
  - [ ] Add environment variables
  - [ ] Deploy and get public URL

---

## 🔥 Firebase Setup (Required)

Firebase is required to persist your values assessments over time.

**Estimated time:** 10 minutes

**Full guide:** [FIREBASE_SETUP.md](FIREBASE_SETUP.md)

### Quick Steps:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Cloud Firestore (Test Mode)
4. Add a Web App
5. Copy the `firebaseConfig` values
6. Add them to your `.env.local` file

---

## 🚂 Railway Deployment (Optional)

Deploy your app to the web for free!

**Estimated time:** 5 minutes

**Full guide:** [RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md)

### Quick Steps:
1. Push your code to GitHub
2. Go to [Railway.app](https://railway.app)
3. Create new project from GitHub repo
4. Add environment variables (same as `.env.local`)
5. Deploy and get your public URL

---

## 🆘 Common Issues

### "Firebase: Error (auth/api-key-not-valid)"
- Check that you copied all Firebase config values correctly
- No extra spaces or quotes in `.env.local`

### "Module not found" errors
- Run `npm install` again
- Delete `node_modules` and run `npm install`

### Data not saving
- Verify Firebase is set up correctly
- Check browser console (F12) for errors
- Ensure Firestore is in "Test Mode"

### Railway deployment fails
- Check that all environment variables are set in Railway
- Ensure variable names match exactly (case-sensitive)
- Check deployment logs for specific errors

---

## 📚 Documentation Index

| Document | Purpose |
|----------|---------|
| [README.md](README.md) | Project overview and features |
| **[FIREBASE_SETUP.md](FIREBASE_SETUP.md)** | **Complete Firebase setup guide** |
| **[RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md)** | **Railway deployment guide** |
| [QUICK_START.md](QUICK_START.md) | This quick reference (you are here) |

---

## 💡 Tips

- **Local Development**: Always use `.env.local` (never commit this file!)
- **Production**: Set environment variables in Railway dashboard
- **Testing**: Test locally with `npm run build && npm run preview` before deploying
- **Monitoring**: Check Firebase Console to see saved assessments
- **Updates**: Just push to GitHub - Railway auto-deploys

---

## 🎯 What's Next?

After setup:
1. ✅ Create your first values assessment
2. ✅ Check that it saves to Firebase
3. ✅ Deploy to Railway
4. ✅ Share your app URL with others
5. Consider adding authentication for private use
6. Set up production Firestore security rules

---

## 🤝 Need Help?

- Review the detailed guides: [FIREBASE_SETUP.md](FIREBASE_SETUP.md) and [RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md)
- Check browser console (F12) for error messages
- Verify all environment variables are set correctly
- Ensure Firebase Firestore is enabled and in Test Mode

---

Happy tracking! 🎯
