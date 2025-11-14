# 🎨 Quick Transparency Reference

## 📍 Location
**File**: `src/index.css`  
**Section**: `:root` (lines 8-14)

## 🎚️ Controls

```css
--glass-opacity: 0.65;        /* Tab bar & overlays (0.0 = invisible, 1.0 = solid) */
--glass-blur: 18px;           /* Tab bar blur amount */
--glass-saturation: 140%;     /* Color intensity */
--card-opacity: 0.85;         /* All cards throughout app */
--card-blur: 14px;            /* Card blur amount */
```

## ⚡ Quick Presets

### Current (Default)
```css
--glass-opacity: 0.65;
--card-opacity: 0.85;
```

### More Glass (Lighter)
```css
--glass-opacity: 0.45;
--card-opacity: 0.65;
```

### Less Glass (Heavier)
```css
--glass-opacity: 0.85;
--card-opacity: 0.95;
```

### Maximum Glass
```css
--glass-opacity: 0.35;
--card-opacity: 0.55;
--glass-blur: 24px;
--card-blur: 18px;
```

## 💡 Remember
- Lower numbers = More transparent
- Higher blur = Stronger glass effect
- Change values in `src/index.css` then refresh browser
