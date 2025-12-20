# Railway Deployment Fix for Vite + React Apps

## Problem: Healthcheck Failures on Railway

When deploying a Vite + React frontend to Railway, you may encounter healthcheck failures:

```
Attempt #1-14 failed with service unavailable
1/1 replicas never became healthy!
Healthcheck failed!
```

### Root Cause

**Vite's `preview` server is not a production server** and does not properly bind to Railway's dynamically assigned `PORT` environment variable. Railway expects a server listening on `process.env.PORT`, but `npm run preview` doesn't provide this reliably.

## Solution: Add an Express Server

Instead of using `npm run preview`, create a simple Express server to serve your built static files.

---

## Step-by-Step Fix

### Step 1: Install Express

Add Express to your dependencies:

```bash
npm install express
```

Or manually add to `package.json`:

```json
{
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

### Step 2: Create `server.js`

Create a new file `server.js` at the root of your project:

```javascript
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve the built Vite files
app.use(express.static(path.join(__dirname, "dist")));

// Handle all routes by serving index.html (for client-side routing)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
```

**Key points:**
- Uses `process.env.PORT` (Railway sets this automatically)
- Binds to `0.0.0.0` (required for Railway's load balancer)
- Serves static files from `dist` folder
- Catches all routes with `*` to support client-side routing (React Router, etc.)

### Step 3: Update `package.json` Scripts

Add a `start` script:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "start": "node server.js"
  }
}
```

### Step 4: Update `railway.json`

Change the start command to use `npm start`:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/",
    "healthcheckTimeout": 300
  }
}
```

### Step 5: Update `package-lock.json`

**CRITICAL:** After adding Express, you must update your lock file:

```bash
npm install
```

This ensures `package-lock.json` is in sync with `package.json`. Railway uses `npm ci` which requires exact synchronization, so missing this step will cause build failures.

### Step 6: Commit and Push

```bash
git add .
git commit -m "Add Express server for Railway deployment"
git push
```

---

## Why This Works

1. **Railway builds your app** → `npm run build` creates the `dist` folder
2. **Railway starts Express** → `npm start` runs `node server.js`
3. **Express binds to PORT** → Server listens on Railway's assigned port
4. **Healthcheck succeeds** → Express responds to `/` requests
5. **Static files served** → All routes serve your React app

---

## Common Issues & Solutions

### Issue: `npm ci` fails with "Missing: express@..." errors

**Solution:** Run `npm install` locally to update `package-lock.json` before pushing.

```bash
npm install
git add package-lock.json
git commit -m "Update package-lock.json"
git push
```

### Issue: Server still not responding

**Check:**
- Is `server.js` at the project root?
- Does `package.json` have `"type": "module"`? (Required for ES6 imports)
- Is the build creating a `dist` folder?

### Issue: 404 on client-side routes

**Solution:** Make sure your server.js has the catch-all route (`app.get("*", ...)`) AFTER the static file middleware. This ensures React Router routes work correctly.

---

## Alternative: Using CommonJS (if you don't use ES modules)

If your `package.json` doesn't have `"type": "module"`, use CommonJS syntax:

```javascript
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## Summary Checklist

- [ ] Installed Express: `npm install express`
- [ ] Created `server.js` with Express server code
- [ ] Added `"start": "node server.js"` to `package.json` scripts
- [ ] Updated `railway.json` startCommand to `"npm start"`
- [ ] Ran `npm install` to sync `package-lock.json`
- [ ] Committed and pushed all changes

---

## Additional Railway Tips

### Pin Nixpacks Version (Prevent Surprise Updates)

Add to Railway service variables:
- Variable: `NIXPACKS_VERSION`
- Value: `1.41.0` (or current stable version)

This prevents deployment failures when Railway updates their build system.

### Environment Variables

Make sure all your Vite environment variables are prefixed with `VITE_`:
- `VITE_FIREBASE_API_KEY=...`
- `VITE_API_URL=...`

These are embedded at build time, so set them in Railway's Variables tab before building.

---

## Verification

After deployment, check:

1. ✅ Build succeeds (no errors in build logs)
2. ✅ Healthcheck passes (no "service unavailable" errors)
3. ✅ App loads at Railway URL
4. ✅ All routes work (test client-side routing)
5. ✅ Static assets load (images, CSS, JS files)

If all checks pass, your deployment is working correctly! 🎉

