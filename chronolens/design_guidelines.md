# ChronoLens Design Guidelines

## Authentication & Account Management

**Authentication Required**: The app has user accounts, community features, and gamification.

**Implementation**:
- Use SSO (Single Sign-On) with Apple Sign-In (iOS) and Google Sign-In (Android/cross-platform)
- Mock auth flow in prototype using local state
- **Onboarding Flow**: 
  - Welcome screen with value proposition ("Preserve your memories across time")
  - SSO login/signup screen with privacy policy & terms links
  - Profile setup: Choose avatar (generate 4 vintage camera/photography-themed avatars), display name, optional bio
  
**Account Management**:
- Profile screen includes: Avatar, display name, bio, total points, joined date
- Settings nested under Profile tab
- Log out with confirmation alert
- Delete account under Settings > Account > Delete Account (double confirmation with warning about photo deletion)

---

## Navigation Architecture

**Root Navigation**: Tab Bar (4 tabs + Floating Action Button)

**Tab Structure**:
1. **Timeline** (Home) - Personal photo collection organized chronologically
2. **Explore** - Community feed with shared photos
3. **Camera/Upload** (Floating Action Button) - Core action for adding photos
4. **Profile** - User profile, stats, and settings

**Navigation Stacks**:
- Timeline Stack: Timeline → Photo Detail → Edit Photo
- Explore Stack: Explore Feed → Photo Detail → User Profile (other users)
- Profile Stack: Profile → Settings → Edit Profile

**Modal Screens**:
- Camera/Upload flow (full-screen modal)
- Year/Time Period Picker
- Comments sheet (bottom sheet modal)

---

## Screen Specifications

### 1. Timeline Screen (Home)
**Purpose**: Browse personal photo collection organized by time periods

**Layout**:
- Header: Transparent, title "My Timeline", right button: Filter (funnel icon)
- Main content: Scrollable with decade/year sections
- Safe area insets: top = headerHeight + Spacing.xl, bottom = tabBarHeight + Spacing.xl

**Components**:
- Decade section headers (large, bold: "1990s", "2000s", etc.)
- Year subsection headers (medium: "1995", "1996")
- Photo grid: 3 columns, square thumbnails with subtle borders
- Empty state: Illustration with "Start archiving your memories" CTA
- Search bar in header (slides down when scrolling up)

### 2. Explore Screen (Community Feed)
**Purpose**: Discover and engage with community-shared photos

**Layout**:
- Header: Transparent, title "Explore", right button: Time Period Filter
- Main content: Scrollable feed
- Safe area insets: top = headerHeight + Spacing.xl, bottom = tabBarHeight + Spacing.xl

**Components**:
- Time period filter chips (horizontal scroll): "All Time", "1950s", "1960s", etc.
- Feed cards with: Photo, username with avatar, caption, time period tag, points badge, like/comment counts
- Infinite scroll with loading indicator
- Pull to refresh

### 3. Camera/Upload Modal
**Purpose**: Add new photos to archive

**Layout**:
- Full-screen modal with close button (X) in top-left
- Two-step flow:
  1. Photo source: "Take Photo" or "Choose from Library"
  2. Photo details form

**Form Components** (Step 2):
- Photo preview (large, centered)
- Year/Time Period picker (tappable, opens modal picker)
- Caption field (optional, multiline)
- Tag field (optional, comma-separated)
- Privacy toggle: "Share with community" (default OFF)
- Submit button: "Save to Timeline" (bottom, full-width)
- Cancel button: In header as left button

**Safe area**: top = insets.top + Spacing.xl, bottom = insets.bottom + Spacing.xl

### 4. Photo Detail Screen
**Purpose**: View full photo with metadata and engagement

**Layout**:
- Header: Transparent with back button, right button: Share (if own photo) or Report (if community photo)
- Main content: Scrollable
- Safe area insets: top = headerHeight + Spacing.xl, bottom = insets.bottom + Spacing.xl

**Components**:
- Full-width photo (pinch to zoom enabled)
- Metadata card: Time period badge, upload date, tags
- Caption (if present)
- For community photos: User attribution, like/comment buttons
- Comments section (expandable)
- Floating delete button (if own photo): bottom-right, with shadow (shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.10, shadowRadius: 2)

### 5. Profile Screen
**Purpose**: View personal stats, settings, and manage account

**Layout**:
- Header: Default navigation header, title "Profile", right button: Settings (gear icon)
- Main content: Scrollable
- Safe area insets: top = Spacing.xl, bottom = tabBarHeight + Spacing.xl

**Components**:
- Profile header: Large avatar (center), display name, bio, points badge
- Stats row: Total Photos | Community Shares | Points Earned
- "Edit Profile" button (outlined)
- Personal photo grid (recent uploads, 3 columns)
- Settings accessible via header button

### 6. Settings Screen
**Purpose**: Manage app preferences and account

**Layout**:
- Header: Default with back button, title "Settings"
- Main content: Scrollable form/list
- Submit/cancel in header

**Sections**:
- Notifications (toggle switches)
- Theme preferences (Light/Dark/Auto)
- Privacy settings
- Account section: Edit Profile, Change Password, Log Out, Delete Account (nested)

---

## Design System

### Color Palette
**Primary**: 
- Sepia/Warm Brown (#8B6F47) - Nostalgic, photo archive feel
- Accent Gold (#D4AF37) - Points, achievements, highlights

**Neutrals**:
- Background: #FAFAF8 (light warm off-white)
- Surface: #FFFFFF
- Text Primary: #2C2C2C
- Text Secondary: #6B6B6B
- Borders: #E5E5E0

**Semantic**:
- Success: #4CAF50
- Error: #E53935
- Community Blue: #5B9BD5 (for shared photos)

### Typography
- **Headline**: SF Pro Display Bold, 28pt
- **Title**: SF Pro Display Semibold, 20pt
- **Body**: SF Pro Text Regular, 16pt
- **Caption**: SF Pro Text Regular, 14pt, #6B6B6B
- **Time Period Tags**: SF Pro Text Medium, 12pt, uppercase

### Spacing System
- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px

### Component Specifications

**Photo Cards (Explore Feed)**:
- Corner radius: 12px
- Shadow: shadowOffset {width: 0, height: 1}, shadowOpacity: 0.08, shadowRadius: 3
- Padding: md
- Visual feedback: Scale to 0.98 on press

**Buttons**:
- Primary: Sepia background, white text, 48px height, full corner radius
- Secondary: Outlined (1px sepia border), sepia text
- Visual feedback: Opacity 0.7 on press

**Floating Action Button (Camera/Upload)**:
- Size: 56px diameter
- Background: Accent Gold gradient
- Icon: Camera (Feather icon)
- Shadow: shadowOffset {width: 0, height: 2}, shadowOpacity: 0.10, shadowRadius: 2
- Position: Center-bottom, elevated above tab bar

**Time Period Tags**:
- Pill shape (full corner radius)
- Background: Sepia with 10% opacity
- Text: Sepia, uppercase, 12pt
- Padding: vertical sm, horizontal md

**Point Badges**:
- Small circle or pill
- Background: Accent Gold
- Icon: Star (Feather)
- Appears next to usernames and on profile

---

## Critical Assets

1. **User Avatars (4 presets)**:
   - Vintage camera illustration
   - Film roll illustration
   - Polaroid frame illustration
   - Photo album illustration
   - Style: Line art, sepia-toned, nostalgic aesthetic

2. **Empty State Illustrations**:
   - Timeline empty: Stack of old photos with magnifying glass
   - Explore empty: Globe with photo pins
   - Style: Simple, warm, inviting

3. **Onboarding Illustrations** (3 screens):
   - Screen 1: Family photos floating in timeline
   - Screen 2: Community sharing concept
   - Screen 3: Points/gamification visualization

**Icon Set**: Use Feather icons from @expo/vector-icons for consistency

---

## Accessibility
- Minimum touch target: 44x44pt
- Color contrast ratio: 4.5:1 minimum
- All images require alt text (auto-suggest based on time period)
- Support Dynamic Type for text scaling
- VoiceOver labels for all interactive elements