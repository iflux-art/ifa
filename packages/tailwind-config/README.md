# @repo/tailwind-config

Shared Tailwind CSS configurations for the monorepo with modern design system and theming support.

## Configurations

### `base.js`
Base Tailwind configuration with:
- Custom color palette with brand and semantic colors
- Extended typography with Inter and JetBrains Mono fonts
- Custom spacing, border radius, and shadow utilities
- Smooth animations and transitions
- All official Tailwind plugins included

### `nextjs.js`
Tailwind configuration optimized for Next.js applications with:
- Content paths for Next.js App Router and Pages Router
- Typography plugin configuration for markdown content
- CSS custom properties support for theming
- Responsive design utilities

### `react.js`
Tailwind configuration for React component libraries with:
- CSS custom properties for dynamic theming
- Safelist for commonly used component classes
- Component-focused utilities and transitions

## Usage

### In Next.js Apps

Create a `tailwind.config.js` file in your app root:

```js
/** @type {import('tailwindcss').Config} */
module.exports = require('@repo/tailwind-config/nextjs')
```

Or extend it with custom configuration:

```js
const baseConfig = require('@repo/tailwind-config/nextjs')

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...baseConfig,
  theme: {
    ...baseConfig.theme,
    extend: {
      ...baseConfig.theme.extend,
      // Your custom extensions
    },
  },
}
```

### In React Libraries

Create a `tailwind.config.js` file in your package root:

```js
/** @type {import('tailwindcss').Config} */
module.exports = require('@repo/tailwind-config/react')
```

### Global Styles

Import the global CSS file in your app:

```js
// In your main CSS file or _app.tsx
import '@repo/tailwind-config/globals.css'
```

### PostCSS Configuration

Copy the PostCSS config to your app:

```js
// postcss.config.js
module.exports = require('@repo/tailwind-config/postcss.config.js')
```

## Features

### Design System
- **Brand Colors**: Complete brand color palette with 50-950 shades
- **Semantic Colors**: Success, warning, and error color systems
- **Typography**: Inter for UI, JetBrains Mono for code
- **Spacing**: Extended spacing scale with custom values
- **Animations**: Smooth fade, slide, and bounce animations

### Theming Support
- **CSS Custom Properties**: Dynamic theming with CSS variables
- **Dark Mode**: Built-in dark mode support
- **Component Classes**: Pre-built component utility classes

### Plugins Included
- **@tailwindcss/forms**: Better form styling
- **@tailwindcss/typography**: Rich text formatting
- **@tailwindcss/aspect-ratio**: Aspect ratio utilities
- **@tailwindcss/container-queries**: Container query support

### Component Utilities
- **Buttons**: `.btn`, `.btn-primary`, `.btn-secondary`, etc.
- **Cards**: `.card` with proper styling
- **Inputs**: `.input` with focus states
- **Animations**: `.animate-in`, `.fade-in`, `.slide-in-*`, etc.

## Color Palette

### Brand Colors
- `brand-50` to `brand-950`: Primary brand colors
- CSS variables: `rgb(var(--primary))`, `rgb(var(--primary-foreground))`

### Semantic Colors
- `success-*`: Green palette for success states
- `warning-*`: Yellow/orange palette for warnings
- `error-*`: Red palette for errors

### Theme Colors (CSS Variables)
- `background`, `foreground`: Base colors
- `card`, `card-foreground`: Card colors
- `primary`, `primary-foreground`: Primary action colors
- `secondary`, `secondary-foreground`: Secondary action colors
- `muted`, `muted-foreground`: Muted text and backgrounds
- `accent`, `accent-foreground`: Accent colors
- `destructive`, `destructive-foreground`: Destructive action colors
- `border`, `input`, `ring`: Border and focus colors

## Typography

### Font Families
- **Sans**: Inter with system font fallbacks
- **Mono**: JetBrains Mono with monospace fallbacks

### Font Sizes
Extended font size scale from `xs` to `9xl` with optimized line heights.

## Animations

### Built-in Animations
- `fade-in`, `fade-out`: Opacity transitions
- `slide-in`, `slide-out`: Transform transitions
- `bounce-gentle`: Subtle bounce effect

### Animation Utilities
- `.animate-in`, `.animate-out`: Base animation classes
- `.fade-in`, `.zoom-in`: Entry animations
- `.slide-in-from-*`: Directional slide animations

## Development

### Customization
All configurations can be extended or overridden in your local `tailwind.config.js` files.

### Performance
- Optimized content paths for fast builds
- Safelist for component libraries to prevent purging
- Modern CSS features with fallbacks