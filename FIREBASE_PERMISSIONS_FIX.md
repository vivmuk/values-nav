# Firebase Permissions Fix

## Error: "Missing or insufficient permissions"

If you see this error when trying to read or write to Firestore:

```
FirebaseError: Missing or insufficient permissions.
Error fetching from Firestore: FirebaseError: Missing or insufficient permissions.
Error syncing to Firestore: FirebaseError: Missing or insufficient permissions.
```

This means your Firestore security rules are blocking access. You need to update them in the Firebase Console.

---

## Solution: Update Firestore Security Rules

### Step 1: Go to Firebase Console

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `values-navigator`
3. Navigate to **Firestore Database** in the left sidebar
4. Click on the **Rules** tab

### Step 2: Update Security Rules

Replace the default rules with these rules that allow read/write access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to assessments collection
    match /assessments/{document=**} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ Security Note:** The rule `if true` allows anyone to read and write. This is fine for development/testing, but for production, you should implement proper authentication and authorization.

### Step 3: Publish the Rules

1. Click **Publish** button at the top
2. Wait for confirmation that rules are published

### Step 4: Test

Refresh your app and try to:
- View your assessment history
- Save a new assessment

The permissions errors should be gone!

---

## Production-Ready Security Rules (Optional)

For a more secure setup, you can require authentication:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write only for authenticated users
    match /assessments/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

This requires users to be logged in before they can read or write data.

---

## Alternative: Public Read, Authenticated Write

If you want the data to be publicly readable but only writable by authenticated users:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /assessments/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## Testing Your Rules

1. **In Firebase Console:**
   - Go to Firestore → Rules tab
   - Use the **Rules Playground** (bottom of the page) to test your rules
   - Select operation (read/write), path (`assessments/{docId}`), and test

2. **In Your App:**
   - Check browser console for errors
   - Verify data loads correctly
   - Try creating a new entry

---

## Quick Reference

- **Current Collection:** `assessments`
- **Current Rules:** Default rules (block all access)
- **Recommended for Development:** `allow read, write: if true;`
- **Recommended for Production:** `allow read, write: if request.auth != null;`

---

## Common Issues

### Rules published but still getting errors?

- **Wait a few seconds** - Rules can take up to 1 minute to propagate
- **Hard refresh your browser** (Ctrl+Shift+R or Cmd+Shift+R)
- **Check the rules syntax** - Make sure there are no syntax errors

### Still seeing permission errors?

- Verify you're connected to the correct Firebase project
- Check that the collection name matches: `assessments`
- Verify your Firebase config in `cloudService.ts` is correct

---

## Summary

1. ✅ Go to Firebase Console → Firestore → Rules
2. ✅ Replace rules with: `allow read, write: if true;` (for development)
3. ✅ Click Publish
4. ✅ Refresh your app
5. ✅ Test read/write operations

Your Firebase permissions should now be working! 🎉

