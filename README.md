# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
# lingua

> A Duolingo-inspired AI language learning app built with **Expo**, **React Native**, **Clerk**, and **Stream** — featuring a real-time AI voice teacher (Luna) powered by OpenAI.

---

## 🧠 What Is This?

**Lingua** is a production-quality, feature-by-feature teaching project that demonstrates how to build a modern AI-powered mobile language learning app. It is designed to be approachable for students while feeling like a real, polished product.

Users can:
- Choose a language to learn
- Take interactive audio lessons with an AI voice teacher called **Luna**
- See real-time speech captions as Luna speaks and as they respond
- Track their XP and streaks locally
- Authenticate securely with Clerk
- Have their learning progress tracked with PostHog analytics

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Expo](https://expo.dev) ~57 + [React Native](https://reactnative.dev) 0.86 |
| Language | TypeScript |
| Routing | [Expo Router](https://expo.github.io/router/docs) (file-based) |
| Styling | [NativeWind](https://www.nativewind.dev) v5 (Tailwind CSS for RN) |
| Auth | [Clerk](https://clerk.com) (`@clerk/expo`) |
| Real-time Video/Audio | [Stream](https://getstream.io) (`@stream-io/video-react-native-sdk`) |
| AI Voice Teacher | [vision-agents SDK](https://github.com/GetStream/vision-agent) + OpenAI Realtime API |
| Global State | [Zustand](https://github.com/pmndrs/zustand) |
| Persistence | AsyncStorage |
| Analytics | [PostHog](https://posthog.com) (`posthog-react-native`) |
| Fonts | Poppins (via `expo-font`) |

---

## ✨ Features

- 🌍 **Language Selection** — choose from a curated list of supported languages
- 🤖 **AI Voice Teacher (Luna)** — real-time voice conversation with an AI teacher via Stream WebRTC + OpenAI Realtime API
- 💬 **Live Captions** — real-time speech-to-text subtitles for both Luna and the student
- 🔇 **Smart Mic Management** — mic auto-mutes when Luna speaks, auto-unmutes when she finishes
- 🎧 **Bluetooth Audio Routing** — automatically routes audio to connected Bluetooth devices
- 🔐 **Authentication** — secure sign-up / sign-in via Clerk (email + OAuth)
- 📊 **Analytics** — PostHog event tracking for `language_selected`, `lesson_started`, and `lesson_abandoned`
- 🏆 **XP & Streaks** — local lesson progress stored with Zustand + AsyncStorage

---

## 📁 Project Structure

```
DualingoApp/
├── src/
│   ├── app/                        # Expo Router screens & API routes
│   │   ├── _layout.tsx             # Root layout: Clerk, PostHog identity, Stream provider
│   │   ├── index.tsx               # Entry point / auth redirect
│   │   ├── onboarding.tsx          # Onboarding flow
│   │   ├── choose-language.tsx     # Language picker screen
│   │   ├── (tabs)/                 # Bottom tab screens (home, profile, etc.)
│   │   ├── lesson/
│   │   │   └── [id].tsx            # AI audio lesson screen (Luna + Stream call)
│   │   └── api/
│   │       ├── stream-token+api.ts # Generates Stream user tokens (server-side)
│   │       ├── agent-start+api.ts  # Starts the Luna AI agent for a call
│   │       └── agent-stop+api.ts   # Stops the Luna AI agent
│   ├── components/                 # Reusable UI components
│   ├── config/                     # App-wide config (PostHog, etc.)
│   ├── constants/                  # Centralized image imports, colours
│   ├── data/
│   │   ├── languages.ts            # Supported language list
│   │   ├── lessons.ts              # Hardcoded lesson content (typed)
│   │   └── units.ts                # Lesson units grouping
│   ├── lib/
│   │   ├── agent.ts                # startAgent / stopAgent helpers
│   │   ├── stream.ts               # Stream call ID generation, token fetch
│   │   └── posthog.ts              # Re-exports the PostHog instance
│   ├── store/
│   │   └── useLanguageStore.ts     # Zustand store: selected language, XP, streaks
│   ├── theme/                      # Font assets, design tokens
│   └── types/                      # Shared TypeScript types
├── vision-agent/                   # Luna AI teacher Python service
│   ├── src/vision_agent/
│   │   ├── agent.py                # Agent factory + call join logic
│   │   ├── free_providers.py       # GroqSTT / EdgeTTS with caption callbacks
│   │   └── __main__.py             # CLI entry: `python -m vision_agent`
│   ├── instructions.md             # Luna's personality + teaching prompt
│   └── .env                        # Secrets (never commit)
├── assets/                         # Images, fonts, icons
├── global.css                      # NativeWind global styles + utilities
└── app.json                        # Expo config
```

---

## ⚙️ Environment Setup

### 1. Clone & install

```bash
git clone <repo-url>
cd DualingoApp
npm install
```

### 2. Environment variables

Create a `.env` file at the project root:

```env
# Clerk
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...

# Stream
EXPO_PUBLIC_STREAM_API_KEY=...
STREAM_API_SECRET=...

# PostHog
EXPO_PUBLIC_POSTHOG_API_KEY=phc_...
EXPO_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# Luna Agent
EXPO_PUBLIC_AGENT_BASE_URL=http://localhost:8000
```

> **Never expose `STREAM_API_SECRET` or `OPENAI_API_KEY` in the frontend.** These are used only in server-side API routes or the vision-agent service.

### 3. Start the Expo app

```bash
npx expo start
```

Use a **development build** (not Expo Go) because the Stream WebRTC native module requires native code:

```bash
# Android
npx expo run:android

# iOS
npx expo run:ios
```

### 4. Start the Luna AI agent service

See [`vision-agent/README.md`](./vision-agent/README.md) for full setup. Quick start:

```powershell
cd vision-agent
.\.venv\Scripts\python.exe -m vision_agent serve --port 8000
```

---

## 🔌 API Routes

All API routes live under `src/app/api/` and run server-side via Expo Router's API route support (`web.output: "server"` in `app.json`).

| Route | Method | Purpose |
|---|---|---|
| `/api/stream-token` | `POST` | Generates a Stream user token for the authenticated Clerk user |
| `/api/agent-start` | `POST` | Calls the vision-agent `/start` endpoint to join Luna to a call |
| `/api/agent-stop` | `POST` | Calls the vision-agent `/stop` endpoint to remove Luna from a call |

---

## 📊 Analytics (PostHog)

PostHog is initialized once in `src/config/posthog.ts` and provided via `PostHogProvider` in `_layout.tsx`.

### User Identification

Handled in the `PostHogIdentity` component inside `_layout.tsx`:
- Calls `posthog.identify(userId)` after Clerk auth
- Sets `signup_date` (via `$set_once`) and `preferred_language` on first identify
- Updates `preferred_language` on subsequent identifies if it changes
- Calls `posthog.reset()` on sign-out

### Tracked Events

| Event | When | Properties |
|---|---|---|
| `language_selected` | User confirms language on the picker screen | `language_code`, `language_name` |
| `lesson_started` | Lesson screen mounts | `lesson_id`, `language`, `lesson_number` |
| `lesson_abandoned` | User exits before completing all phrases | `lesson_id`, `time_into_lesson_seconds`, `last_question_index` |

---

## 🔑 Key Design Decisions

- **No custom auth** — Clerk handles all authentication flows
- **No database** — lesson content is hardcoded TypeScript (`data/lessons.ts`); Zustand + AsyncStorage for local state
- **Secrets stay server-side** — Stream tokens and AI calls go through API routes or the vision-agent service; nothing sensitive is bundled into the app
- **NativeWind only** — StyleSheet is used only for the exceptions documented in `AGENTS.md`
- **Feature-by-feature** — the codebase is intentionally readable and teachable; avoid abstraction until repetition demands it

---

## 📚 Learn More

- [Expo Documentation](https://docs.expo.dev)
- [Expo Router](https://expo.github.io/router/docs)
- [NativeWind v5](https://www.nativewind.dev)
- [Clerk Expo](https://clerk.com/docs/references/expo/overview)
- [Stream Video React Native SDK](https://getstream.io/video/docs/react-native/)
- [PostHog React Native](https://posthog.com/docs/libraries/react-native)
- [Luna AI Agent (vision-agent)](./vision-agent/README.md)
