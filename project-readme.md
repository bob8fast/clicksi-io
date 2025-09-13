# Clicksi Website

A modern web platform connecting Ukrainian beauty brands with content creators for impactful collaborations.

## 🎨 Design Goals

- Modern, clean interface with dark/light theme support
- Emphasis on visual hierarchy and brand identity
- Responsive design for all devices
- Smooth animations and transitions
- Accessibility-first approach

## 🚀 Quick Start

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   
   Add your values:
   ```
   NEXT_PUBLIC_CONTACT_WITH_US_TALLY_FORM_ID=your_form_id
   NEXT_PUBLIC_CALENDLY_URL=your_calendly_url
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## 📁 Key Files for Redesign

### Core Components
- `components/HomePage.tsx` - Main landing page
- `components/Modal.tsx` - Reusable modal system
- `components/Footer.tsx` - Site footer

### Styles
- `styles/globals.css` - Theme variables and global styles
- `tailwind.config.js` - Tailwind configuration

### Pages
- `pages/privacy-policy.tsx` - Privacy policy
- `pages/terms-of-service.tsx` - Terms of service

### Icons & Assets
- `components/icons/ClicksiIcons.tsx` - Custom SVG icons

## 🎯 Current Design System

### Colors (CSS Variables)
```css
/* Dark Theme (Default) */
--color-primary: #171717;
--color-secondary: #090909;
--color-light: #EDECF8;
--color-gray-1: #575757;
--color-gray-2: #828288;
--color-accent: #202020;
--color-orange: #D78E59;
--color-orange-light: #FFAA6C;

/* Light Theme */
--color-primary: #FFFFFF;
--color-secondary: #F9FAFB;
--color-light: #111827;
--color-gray-1: #D1D5DB;
--color-gray-2: #6B7280;
--color-accent: #F3F4F6;
--color-orange: #D78E59;
--color-orange-light: #FFAA6C;
```

### Component Patterns
- **Buttons**: Primary (orange) and Secondary (outline)
- **Cards**: Dark backgrounds with subtle borders
- **Sections**: Full-width with constrained content
- **Navigation**: Fixed header with transparent background

## 🔧 Redesign Considerations

1. **Theme System**: Built with CSS variables for easy theme switching
2. **Responsive Design**: Mobile-first with Tailwind breakpoints
3. **Component Architecture**: Modular, reusable components
4. **Performance**: Optimized for Core Web Vitals
5. **Accessibility**: WCAG 2.1 AA compliance target

## 📋 Common Tasks

### Changing Brand Colors
1. Update CSS variables in `globals.css`
2. Modify both dark and light theme values
3. Test contrast ratios for accessibility

### Adding New Sections
1. Follow pattern in `HomePage.tsx`
2. Use consistent spacing (`py-20 px-6 lg:px-8`)
3. Maintain max-width containers (`max-w-7xl mx-auto`)

### Creating New Components
1. Use TypeScript for type safety
2. Follow existing component patterns
3. Use CSS variables for theming
4. Include proper ARIA labels

### Updating Typography
1. Modify font families in `tailwind.config.js`
2. Update font weights in components
3. Ensure readable line heights

## 🌐 External Integrations

- **Tally**: Form submissions
- **Calendly**: Appointment scheduling
- **Lucide React**: Icon library

## 📱 Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## ⚡ Performance Tips

1. Optimize images (use Next.js Image component)
2. Lazy load non-critical components
3. Minimize JavaScript bundle size
4. Use proper caching strategies

## 🐛 Known Issues

- Modal scrolling on mobile devices may need adjustment
- Theme switching requires page refresh in some cases

## 🤝 Contributing

When redesigning:
1. Maintain consistent design language
2. Follow accessibility guidelines
3. Test on multiple devices
4. Document any new patterns

## 📝 License

[Your License Here]

---

For more detailed information, see the project instructions document.