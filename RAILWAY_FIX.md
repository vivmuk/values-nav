# Railway Deployment Fix - Healthcheck Failures

## Problem

Railway deployment was failing with healthcheck errors:
```
Attempt #1-8 failed with service unavailable
1/1 replicas never became healthy!
Healthcheck failed!
```

The app built successfully but failed to respond to health checks.

## Root Cause

The service never became healthy because the start command was launching Vite incorrectly. In some environments, `npm run preview -- --port $PORT --host 0.0.0.0` is parsed by `npm` as npm CLI options (not script args), so Vite receives positional args like `vite preview 8080 0.0.0.0`, treats them as the project root, and exits with “dist does not exist”.

## Solution Applied

### 1. Updated `railway.json`

Changed the start command to just run the preview script (port/host are handled by `vite.config.ts`):

```json
{
  "deploy": {
    "startCommand": "npm run preview",
    "healthcheckTimeout": 300
  }
}
```

**Changes:**
- Increased healthcheck timeout from 100s to 300s for initial startup

### 2. Updated `vite.config.ts`

Simplified and improved port handling:

```typescript
export default defineConfig(({ mode }) => {
    const port = process.env.PORT ? Number(process.env.PORT) : 3000;

    return {
      preview: {
        port: port,
        host: '0.0.0.0',
        strictPort: true,  // Added for Railway compatibility
      },
      // ... rest of config
    };
});
```

**Changes:**
- Simplified PORT environment variable handling
- Added `strictPort: true` to ensure it fails if port is unavailable
- Cleaner logic for Railway vs local development

## How to Deploy

Railway will automatically redeploy when you push to GitHub:

```bash
git push
```

Or manually trigger a deployment in Railway dashboard:
1. Go to your Railway project
2. Click "Deployments" tab
3. Click "Deploy" button

## Verification

After the fix is deployed, you should see:

1. **Build succeeds** (as before)
2. **Healthcheck succeeds** (NEW - this was failing)
3. **Service becomes available** at your Railway URL

Check the deployment logs for:
```
Starting Healthcheck
====================
Path: /
Retry window: 5m0s

✓ Healthcheck passed
```

## Additional Railway Configuration

### Environment Variables Required

Make sure these are set in Railway dashboard (Variables tab):

```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
GEMINI_API_KEY=your_gemini_api_key (optional for AI features)
```

### If Issues Persist

1. **Check Railway logs** for startup errors
2. **Verify PORT is being used**: Look for log lines like `Local: http://localhost:XXXX` and `Network: http://...:XXXX`
3. **Test locally** with Railway's PORT simulation:
   ```bash
   PORT=8080 npm run build && PORT=8080 npm run preview
   ```
4. **Try manual healthcheck**: In Railway dashboard, check the assigned URL

## Technical Details

### Why this matters for Railway

- Railway assigns a **dynamic port** via `$PORT` environment variable
- Apps must bind to `0.0.0.0` (not `localhost` or `127.0.0.1`) for Railway's load balancer
- Vite's preview server defaults to port 4173, but Railway needs dynamic port
- Health checks verify the service is responding before routing traffic

## Additional Issue: npm ci Cache Conflict

### Problem
After the initial fix, deployment failed with:
```
npm error code EBUSY
npm error syscall rmdir
npm error path /app/node_modules/.cache
npm error errno -16
npm error EBUSY: resource busy or locked, rmdir '/app/node_modules/.cache'
```

### Root Cause
The `buildCommand` was running `npm ci` when Nixpacks already runs `npm ci` in its install phase. This caused a conflict with Railway's cache mount on `/app/node_modules/.cache`.

### Solution
Changed `railway.json` buildCommand from:
```json
"buildCommand": "npm ci && npm run build"
```

To:
```json
"buildCommand": "npm run build"
```

Nixpacks handles the install phase automatically, so the buildCommand should only run the actual build step.

## Status

✅ **FIXED** - Ensure Railway starts with `npm run preview` and relies on `vite.config.ts` for `PORT`/`host` binding.

The app should now deploy successfully to Railway!
