# ChronoLens Fonts Setup

## Required Fonts

Download these fonts and place them in this directory:

### 1. **Cinzel** (Historian Theme Headers)
- **File needed**: `Cinzel-Regular.ttf`
- **Download**: https://fonts.google.com/specimen/Cinzel
- **Usage**: Headers and titles in Historian theme
- **Style**: Elegant, classical serif

### 2. **JetBrains Mono** (Metadata & Code)
- **Files needed**: 
  - `JetBrainsMono-Regular.ttf`
  - `JetBrainsMono-Bold.ttf` (optional)
- **Download**: https://fonts.google.com/specimen/JetBrains+Mono
- **Usage**: Catalog numbers, metadata labels, monospace text
- **Style**: Clean, technical monospace

### 3. **Space Mono** (Cyberpunk Theme)
- **File needed**: `SpaceMono-Regular.ttf`
- **Download**: https://fonts.google.com/specimen/Space+Mono
- **Usage**: Headers and body text in Cyberpunk theme
- **Style**: Futuristic, geometric monospace

## Installation Steps

1. Visit each Google Fonts link above
2. Click "Download family" button
3. Extract the ZIP file
4. Copy the required `.ttf` files to this directory
5. Restart your Expo dev server

## Expected Directory Structure

```
assets/fonts/
├── Cinzel-Regular.ttf
├── JetBrainsMono-Regular.ttf
├── JetBrainsMono-Bold.ttf (optional)
└── SpaceMono-Regular.ttf
```

## Verification

After adding fonts, run:
```bash
ls -la assets/fonts/
```

You should see all 4 font files listed.

## Note

The app will use system fonts as fallback if custom fonts are not loaded. Make sure to restart the Expo dev server after adding fonts.
