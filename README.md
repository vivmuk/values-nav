<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Values Navigator

A mindful values assessment tool that helps you track your life alignment across four domains: Work & Education, Relationships, Personal Growth & Health, and Leisure.

View your app in AI Studio: https://ai.studio/apps/drive/19t_MP9uP3AsKUMoootbUXMF7m9OGnhhR

## Features

- 🎯 Interactive Bull's Eye values mapping
- 📊 Historical tracking with beautiful visualizations
- 🔥 Firebase Firestore for cloud persistence
- 🎨 Elegant, haute couture-inspired UI
- 📱 Responsive design for all devices

## Quick Start

### Prerequisites
- Node.js 18+
- Firebase account (for data persistence)
- Gemini API key (for AI features)

### Run Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```
   Edit `.env.local` and add your API keys:
   - `GEMINI_API_KEY` - Get from [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Firebase variables - See [Firebase Setup Guide](FIREBASE_SETUP.md)

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Setup Guides

### 🔥 Firebase Setup (Required for data persistence)
Follow the step-by-step guide: **[FIREBASE_SETUP.md](FIREBASE_SETUP.md)**

This will show you how to:
- Create a Firebase project
- Enable Cloud Firestore
- Get your Firebase configuration
- Connect your app to Firebase

### 🚂 Deploy to Railway

1. **Push your code to a Git repository** (GitHub, GitLab, etc.)

2. **Connect to Railway:**
   - Go to [Railway](https://railway.app)
   - Create a new project
   - Connect your repository

3. **Pin Nixpacks Version (IMPORTANT):**
   To prevent unexpected deployment failures from Nixpacks updates, **pin the version**:
   - Go to your Railway service → Variables tab
   - Add a new variable: `NIXPACKS_VERSION` = `1.41.0`
   - This ensures your build environment stays consistent

4. **Set Environment Variables:**
   Add all your Firebase and API keys in Railway's Variables tab:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `GEMINI_API_KEY` (optional)

5. **Deploy:**
   Railway will automatically detect your app and deploy it!

## Project Structure

```
values-navigator/
├── components/           # React components
│   ├── BullseyeChart.tsx    # Main interactive chart
│   └── HistoryView.tsx      # Timeline visualization
├── services/            # Business logic
│   ├── cloudService.ts      # Firebase Firestore integration
│   ├── dbService.ts         # Local storage fallback
│   └── geminiService.ts     # AI features
├── App.tsx              # Main application component
├── constants.tsx        # App configuration and values
├── types.ts             # TypeScript type definitions
└── vite.config.ts       # Build configuration
```

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build locally
```

## Environment Variables

### Local Development

Create a `.env.local` file with:

```env
# Gemini API Key
GEMINI_API_KEY=your_gemini_api_key

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

See [.env.local.example](.env.local.example) for a template.

### Railway Deployment

**Required Variables:**
- All the Firebase variables listed above (prefixed with `VITE_`)
- `GEMINI_API_KEY` (optional, for AI features)

**Important: Pin Nixpacks Version**
- Add `NIXPACKS_VERSION` = `1.41.0` to prevent build environment changes
- This saves you from waking up to random 404s when Nixpacks updates!

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS (via utility classes)
- **Charts:** Recharts
- **Animation:** Framer Motion
- **Database:** Firebase Firestore
- **AI:** Google Gemini API
- **Deployment:** Railway

## License

MIT
