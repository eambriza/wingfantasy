# Glass Morphism Transparency Guide

## 🎨 Where to Change Transparency

All glass effect transparency settings are centralized in **`src/index.css`** at the top in the `:root` section:

```css
:root {
  /* GLASS TRANSPARENCY CONTROLS - Change these values to adjust glass effect */
  --glass-opacity: 0.65;        /* Main glass background opacity (0.0 - 1.0) */
  --glass-blur: 18px;           /* Blur amount (higher = more blur) */
  --glass-saturation: 140%;     /* Color saturation (100% = normal) */
  --card-opacity: 0.85;         /* Card background opacity (0.0 - 1.0) */
  --card-blur: 14px;            /* Card blur amount */
}
```

## 📊 Recommended Values

### More Transparent (Lighter Glass)
```css
--glass-opacity: 0.45;        /* Very transparent */
--glass-blur: 24px;           /* More blur to compensate */
--glass-saturation: 150%;     /* Higher saturation */
--card-opacity: 0.65;         /* Lighter cards */
--card-blur: 18px;            /* More card blur */
```

### Less Transparent (Heavier Glass)
```css
--glass-opacity: 0.85;        /* More opaque */
--glass-blur: 12px;           /* Less blur */
--glass-saturation: 120%;     /* Lower saturation */
--card-opacity: 0.95;         /* Heavier cards */
--card-blur: 10px;            /* Less card blur */
```

### Subtle Glass (Minimal Effect)
```css
--glass-opacity: 0.95;        /* Almost solid */
--glass-blur: 8px;            /* Minimal blur */
--glass-saturation: 110%;     /* Slight saturation */
--card-opacity: 0.98;         /* Nearly solid cards */
--card-blur: 6px;             /* Minimal card blur */
```

### Extreme Glass (Maximum Effect)
```css
--glass-opacity: 0.35;        /* Very transparent */
--glass-blur: 32px;           /* Heavy blur */
--glass-saturation: 180%;     /* High saturation */
--card-opacity: 0.55;         /* Very light cards */
--card-blur: 24px;            /* Heavy card blur */
```

## 🔧 Glass Classes Applied

### Tab Bar
- **Class**: `.tab-glass`
- **Location**: `src/components/TabBar.tsx`
- **Uses**: `--glass-opacity`, `--glass-blur`, `--glass-saturation`, `--card-opacity`

### Cards (Events, Fantasy, Boards, etc.)
- **Class**: `.rb-card`
- **Location**: Throughout `src/App.tsx`
- **Uses**: `--card-opacity`, `--card-blur`, `--glass-saturation`

### Modal Overlays
- **Class**: `.glass-panel` (available but not yet applied)
- **Location**: Fantasy player picker modal
- **Uses**: `--glass-opacity`, `--glass-blur`, `--glass-saturation`

### Sticky Headers
- **Class**: `.glass-header`
- **Location**: Modal headers, picker headers
- **Uses**: `--card-opacity`, `--glass-blur`, `--glass-saturation`

## 🎯 Quick Adjustments

### Make Everything More Transparent
Change only these two values:
```css
--glass-opacity: 0.45;
--card-opacity: 0.65;
```

### Make Everything Less Transparent
Change only these two values:
```css
--glass-opacity: 0.85;
--card-opacity: 0.95;
```

### Increase Blur Effect
Change only these two values:
```css
--glass-blur: 24px;
--card-blur: 18px;
```

### Decrease Blur Effect
Change only these two values:
```css
--glass-blur: 12px;
--card-blur: 8px;
```

## 📱 Testing Tips

1. **Start with small changes**: Adjust values by 0.05-0.10 increments
2. **Test on different backgrounds**: Glass effects look different over various content
3. **Check readability**: Ensure text remains readable with your transparency settings
4. **Balance blur and opacity**: More transparency usually needs more blur
5. **Consider performance**: Very high blur values (>40px) may impact performance on older devices

## 🔍 Where Glass Effects Are Used

### Tab Bar (Bottom Navigation)
- File: `src/components/TabBar.tsx`
- Class: `tab-glass`
- Effect: Glass background with blur and gradient

### All Cards
- Files: All screens in `src/App.tsx`
- Class: `rb-card`
- Effect: Glass card backgrounds with blur
- Examples: Event cards, Fantasy squad cards, Leaderboard cards, Search tiles

### Modal Backgrounds
- File: `src/App.tsx` (Fantasy player picker)
- Class: `bg-black/60 backdrop-blur-sm`
- Effect: Darkened glass overlay

### Modal Content
- File: `src/App.tsx` (Fantasy player picker)
- Class: `rb-card`
- Effect: Glass modal panel

### Sticky Headers
- File: `src/App.tsx` (Modal headers)
- Class: `glass-header`
- Effect: Glass header that stays visible when scrolling

## 💡 Pro Tips

1. **Opacity + Blur Balance**: 
   - Low opacity (0.4-0.6) → High blur (20-30px)
   - High opacity (0.8-0.95) → Low blur (8-14px)

2. **Saturation Enhancement**:
   - Increase saturation (140-180%) when using high transparency
   - Decrease saturation (100-120%) when using low transparency

3. **Performance Optimization**:
   - Keep blur values under 24px for better performance
   - Use `will-change: backdrop-filter` for animated glass elements

4. **Accessibility**:
   - Ensure text contrast ratio meets WCAG AA standards (4.5:1)
   - Test with different content behind glass elements
   - Avoid transparency below 0.35 for text-heavy areas

## 🚀 Advanced Customization

If you need different transparency for specific elements, you can:

1. Add new CSS variables in `:root`
2. Create new glass classes in `src/index.css`
3. Apply them to specific components

Example:
```css
:root {
  --modal-opacity: 0.75;
  --modal-blur: 20px;
}

.glass-modal {
  background: rgba(18,29,43, var(--modal-opacity));
  backdrop-filter: blur(var(--modal-blur)) saturate(var(--glass-saturation));
  -webkit-backdrop-filter: blur(var(--modal-blur)) saturate(var(--glass-saturation));
}
```

---

**Remember**: After changing values in `src/index.css`, refresh your browser to see the changes!
