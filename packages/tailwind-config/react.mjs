import baseConfig from './base.mjs'

/** @type {import('tailwindcss').Config} */
export default {
  ...baseConfig,
  content: ['./src/**/*.{js,ts,jsx,tsx}', './stories/**/*.{js,ts,jsx,tsx}'],
  theme: {
    ...baseConfig.theme,
    extend: {
      ...baseConfig.theme.extend,
      // Component library specific extensions
      transitionProperty: {
        height: 'height',
        spacing: 'margin, padding',
      },
      // CSS variables for theming
      colors: {
        ...baseConfig.theme.extend.colors,
        // CSS custom properties for dynamic theming
        background: 'rgb(var(--background) / &lt;alpha-value&gt;)',
        foreground: 'rgb(var(--foreground) / &lt;alpha-value&gt;)',
        card: 'rgb(var(--card) / &lt;alpha-value&gt;)',
        'card-foreground': 'rgb(var(--card-foreground) / &lt;alpha-value&gt;)',
        popover: 'rgb(var(--popover) / &lt;alpha-value&gt;)',
        'popover-foreground': 'rgb(var(--popover-foreground) / &lt;alpha-value&gt;)',
        primary: 'rgb(var(--primary) / &lt;alpha-value&gt;)',
        'primary-foreground': 'rgb(var(--primary-foreground) / &lt;alpha-value&gt;)',
        secondary: 'rgb(var(--secondary) / &lt;alpha-value&gt;)',
        'secondary-foreground':
          'rgb(var(--secondary-foreground) / &lt;alpha-value&gt;)',
        muted: 'rgb(var(--muted) / &lt;alpha-value&gt;)',
        'muted-foreground': 'rgb(var(--muted-foreground) / &lt;alpha-value&gt;)',
        accent: 'rgb(var(--accent) / &lt;alpha-value&gt;)',
        'accent-foreground': 'rgb(var(--accent-foreground) / &lt;alpha-value&gt;)',
        destructive: 'rgb(var(--destructive) / &lt;alpha-value&gt;)',
        'destructive-foreground':
          'rgb(var(--destructive-foreground) / &lt;alpha-value&gt;)',
        border: 'rgb(var(--border) / &lt;alpha-value&gt;)',
        input: 'rgb(var(--input) / &lt;alpha-value&gt;)',
        ring: 'rgb(var(--ring) / &lt;alpha-value&gt;)',
      },
      borderRadius: {
        ...baseConfig.theme.extend.borderRadius,
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  // Safelist commonly used classes in component libraries
  safelist: [
    'text-xs',
    'text-sm',
    'text-base',
    'text-lg',
    'text-xl',
    'text-2xl',
    'text-3xl',
    'text-4xl',
    'text-5xl',
    'text-6xl',
    'font-normal',
    'font-medium',
    'font-semibold',
    'font-bold',
    'rounded-none',
    'rounded-sm',
    'rounded',
    'rounded-md',
    'rounded-lg',
    'rounded-xl',
    'rounded-2xl',
    'rounded-3xl',
    'rounded-full',
    'shadow-none',
    'shadow-sm',
    'shadow',
    'shadow-md',
    'shadow-lg',
    'shadow-xl',
    'shadow-2xl',
  ],
}