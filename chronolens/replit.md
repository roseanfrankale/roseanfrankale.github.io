# ChronoLens - Photo Memory Archive

## Overview
ChronoLens is a mobile-first photo archiving and community platform where users can organize photos by time period, share memories with the community, and engage through gamified social features.

**Current State**: Functional prototype with core UI implemented
**Platform**: React Native with Expo SDK

## Project Structure

```
/assets
  /images
    /avatars       - User avatar presets (camera, film, polaroid, album)
    /illustrations - Empty state illustrations
/components        - Reusable UI components
/constants         - Theme, colors, spacing, typography
/hooks             - Custom React hooks (useTheme, useScreenInsets)
/navigation        - React Navigation setup (tabs, stacks)
/screens           - Screen components
/store             - State management (photo store, user store)
```

## Key Features

### Implemented
- **Timeline Screen**: Personal photo collection organized by decades and years
- **Explore Screen**: Community feed with time period filter chips, like/comment functionality
- **Profile Screen**: User stats, avatar, points display, recent uploads grid
- **Upload Modal**: Camera/gallery picker with year selection, caption, tags, share toggle
- **Photo Detail Screen**: Full photo view with metadata, comments, like/share actions
- **Settings Screen**: Notifications, privacy, appearance, account management
- **Edit Profile Screen**: Avatar selection, display name, bio editing
- **User Profile Screen**: View other users' profiles and shared photos

### Gamification
- Points earned for uploading photos (10 points)
- Bonus points for sharing with community (15 points)
- Points displayed on profile and user badges

## Design System

### Colors (Sepia/Nostalgic Theme)
- Primary: #8B6F47 (warm sepia brown)
- Accent: #D4AF37 (gold for points/achievements)
- Background: #FAFAF8 (warm off-white)
- Community Blue: #5B9BD5

### Navigation
- Bottom tabs: Timeline, Explore, Profile
- Floating Action Button: Camera/Upload (gold accent)
- Modal presentation for upload flow

## Tech Stack
- React Native 0.79.3 with Expo SDK 54
- React Navigation 7 (bottom tabs + native stacks)
- React Native Reanimated for animations
- React Native Gesture Handler
- expo-image-picker for camera/gallery access

## Next Phase (Backend)
- User authentication (SSO with Apple/Google)
- Persistent photo storage (cloud sync)
- Real-time community features
- Push notifications for engagement
- Family tree builder
- Ad integration for monetization

## Running the App
- Development: `npm run dev` (Expo dev server)
- Web preview: Available at localhost:8081
- Mobile testing: Scan QR code with Expo Go app

## User Preferences
- Mobile-first design prioritized
- iOS 26 liquid glass UI aesthetic
- No emojis in app UI
- Warm, nostalgic color palette
