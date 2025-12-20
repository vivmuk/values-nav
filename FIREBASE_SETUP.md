# Firebase Setup Instructions for Values Navigator

This guide will walk you through setting up Firebase Firestore to persist your values assessments in the cloud.

---

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter a project name (e.g., "Values Navigator")
4. Follow the prompts (you can disable Google Analytics if you don't need it)
5. Click **"Create Project"**

---

## Step 2: Enable Cloud Firestore

1. In your Firebase project dashboard, click **"Firestore Database"** in the left sidebar
2. Click **"Create database"**
3. Select **"Start in test mode"** for development (you can secure it later)
4. Choose a Firestore location (select the closest region to your users)
5. Click **"Enable"**

### Security Rules (Optional - for Production)

For production, update your Firestore rules in the Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /assessments/{document=**} {
      // Allow anyone to read and write (adjust based on your auth needs)
      allow read, write: if true;

      // OR if you add authentication later:
      // allow read, write: if request.auth != null;
    }
  }
}
```

---

## Step 3: Register Your Web App

1. In the Firebase Console, click the **Settings gear icon** (⚙️) next to "Project Overview"
2. Select **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click the **Web icon** (`</>`) to add a web app
5. Enter an app nickname (e.g., "Values Navigator Web")
6. **Do NOT** check "Firebase Hosting" (we'll use Railway)
7. Click **"Register app"**

---

## Step 4: Copy Your Firebase Configuration

After registering, Firebase will show you a configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

**Copy this entire object** - you'll need it in the next step.

---

## Step 5: Update Your Cloud Service File

1. Open `services/cloudService.ts` in your code editor
2. Replace the placeholder config (lines 7-14) with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "YOUR_ACTUAL_AUTH_DOMAIN",
  projectId: "YOUR_ACTUAL_PROJECT_ID",
  storageBucket: "YOUR_ACTUAL_STORAGE_BUCKET",
  messagingSenderId: "YOUR_ACTUAL_MESSAGING_SENDER_ID",
  appId: "YOUR_ACTUAL_APP_ID"
};
```

3. Save the file

---

## Step 6: Test Locally

1. Run your app:
   ```bash
   npm run dev
   ```

2. Open the app in your browser (usually http://localhost:3000)

3. Go to "The Compass" and create a values assessment

4. Click **"Commit to Daily Archive"**

5. Check the Firebase Console:
   - Go to **Firestore Database**
   - You should see an `assessments` collection with your entry

---

## Step 7: Verify Data Persistence

1. In your app, navigate to **"The Timeline"** view
2. You should see your saved assessment
3. Refresh the page - the data should persist (loaded from Firestore)
4. Create another assessment and verify it appears in the timeline

---

## Troubleshooting

### Error: "Firebase: Error (auth/api-key-not-valid)"
- Double-check that you copied the API key correctly
- Make sure there are no extra spaces or quotes

### Error: "Missing or insufficient permissions"
- Go to Firestore Database > Rules in Firebase Console
- Ensure you're in "test mode" or have appropriate read/write rules

### Data not appearing in Timeline
- Open browser DevTools Console (F12) and check for errors
- Verify the `assessments` collection exists in Firestore Console
- Check that your Firebase config is correct

### CORS errors
- Firebase Firestore should automatically handle CORS
- If you see CORS errors, ensure your domain is registered in Firebase (for production)

---

## Environment Variables (Recommended for Production)

For better security, you can use environment variables instead of hardcoding your Firebase config:

1. Create a `.env.local` file in your project root:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

2. Update `services/cloudService.ts`:
   ```typescript
   const firebaseConfig = {
     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
     storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
     messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
     appId: import.meta.env.VITE_FIREBASE_APP_ID
   };
   ```

3. Add `.env.local` to your `.gitignore` (already done if you follow Railway setup)

---

## Next Steps

Once Firebase is working locally, see [RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md) for instructions on deploying to Railway with environment variables.

---

## Support

- [Firebase Documentation](https://firebase.google.com/docs/firestore)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
