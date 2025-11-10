# Firestore Setup Instructions

## Important: Set Up Firestore Database

Before you can save and retrieve players, you need to enable Firestore in your Firebase Console.

### Step 1: Enable Firestore

1. Go to Firebase Console: https://console.firebase.google.com/project/soccer-match-d03fa
2. Click on **Firestore Database** in the left sidebar
3. Click **Create database**
4. Choose **Start in production mode** (we'll add rules next)
5. Select your preferred location (choose closest to your users)
6. Click **Enable**

### Step 2: Set Up Security Rules

1. In Firestore Database, go to the **Rules** tab
2. Replace the existing rules with the content from `firestore.rules` file:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Players collection - users can only read/write their own data
    match /players/{playerId} {
      // Allow users to read only their own players
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      
      // Allow users to create players with their own userId
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      
      // Allow users to update only their own players
      allow update: if request.auth != null && resource.data.userId == request.auth.uid;
      
      // Allow users to delete only their own players
      allow delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

3. Click **Publish**

### What These Rules Do:

✅ **Privacy**: Each user can ONLY see their own players
✅ **Security**: Users cannot read, modify, or delete other users' data
✅ **Authentication**: Only logged-in users can access the database
✅ **Data Integrity**: Players are always associated with the correct user

### Step 3: Test Your App

After setting up Firestore and the rules:
1. Run your app: `npm run dev`
2. Sign in with Google
3. Add a player - it will be saved to Firestore
4. View players - you'll see your players list
5. Sign out and sign in as different user - you'll see different data

## Firestore Data Structure

```
players (collection)
  └─ {playerId} (document)
      ├─ playerName: "John Doe"
      ├─ defenseScore: 8
      ├─ offenseScore: 7
      ├─ userId: "user_firebase_uid"
      └─ createdAt: "2025-11-10T12:00:00Z"
```

Each player document is automatically assigned a unique ID by Firestore.
