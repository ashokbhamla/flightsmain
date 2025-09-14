# CSS Reference for FlightSearchs Project

## Overview
This project now uses separate CSS files instead of inline styles for better maintainability and reusability.

## CSS Files Structure

### 1. `styles/globals.css`
Global styles and base styling for the entire application.

### 2. `styles/components.css`
Component-specific styles for reusable components.

## How to Use CSS Classes

### Header Component
```tsx
// Instead of inline styles:
<Box sx={{ background: 'white', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>

// Use CSS classes:
<Box className="header-container">
```

### Hero Section
```tsx
// Instead of inline styles:
<Box sx={{ background: '#1e3a8a', color: 'white', py: { xs: 4, sm: 6 } }}>

// Use CSS classes:
<Box className="hero-section">
```

### Content Sections
```tsx
// Instead of inline styles:
<Box sx={{ mb: 6 }}>
  <Typography sx={{ textAlign: 'left', mb: 4, color: '#333', fontWeight: 700, fontSize: '1.5rem' }}>

// Use CSS classes:
<Box className="content-section">
  <Typography className="content-section-heading">
```

### Content Info
```tsx
// Instead of inline styles:
<Box sx={{ mt: 3, mb: 1, px: { xs: 2, sm: 4, md: 6 } }}>
  <Typography sx={{ color: '#1a1a1a', mb: 1, textAlign: 'left', fontWeight: 600, fontSize: '1.1rem' }}>

// Use CSS classes:
<Box className="content-info">
  <Typography className="content-info-heading">
```

### FAQ Accordion
```tsx
// Instead of inline styles:
<Accordion sx={{ '& .MuiAccordion-root': { boxShadow: '...' } }}>

// Use CSS classes:
<Accordion className="faq-accordion-container">
```

## Available CSS Classes

### Layout Classes
- `.hero-section` - Blue hero section with full background
- `.content-section` - Content section with proper margins
- `.content-info` - Individual info sections

### Typography Classes
- `.hero-heading` - Main hero heading (h1)
- `.hero-subheading` - Hero subheading (h6)
- `.content-section-heading` - Section headings (h3, h4)
- `.content-info-heading` - Info section headings (h5)
- `.content-info-text` - Info section text content

### Component Classes
- `.header-container` - Header wrapper
- `.header-toolbar` - Header toolbar
- `.header-logo` - Logo styling
- `.header-nav-button` - Navigation buttons
- `.faq-accordion-container` - FAQ accordion styling
- `.faq-question` - FAQ question text
- `.faq-answer` - FAQ answer text

### Utility Classes
- `.text-center` - Center text alignment
- `.text-left` - Left text alignment
- `.text-right` - Right text alignment
- `.mb-1`, `.mb-2`, `.mb-3`, `.mb-4` - Margin bottom utilities
- `.mt-1`, `.mt-2`, `.mt-3`, `.mt-4` - Margin top utilities
- `.p-1`, `.p-2`, `.p-3`, `.p-4` - Padding utilities

## Benefits of Using CSS Files

1. **Maintainability**: Easy to update styles across the entire project
2. **Reusability**: CSS classes can be reused across components
3. **Performance**: Better CSS optimization and caching
4. **Readability**: Cleaner component code without inline styles
5. **Consistency**: Ensures consistent styling across the application
6. **Responsiveness**: Centralized responsive design rules

## Migration Guide

### Step 1: Replace Inline Styles
```tsx
// Before (inline styles):
<Box sx={{ mb: 6, px: { xs: 2, sm: 4, md: 6 } }}>

// After (CSS classes):
<Box className="content-section">
```

### Step 2: Use Appropriate CSS Classes
```tsx
// For section headings:
<Typography className="content-section-heading">

// For content info:
<Box className="content-info">
  <Typography className="content-info-heading">
  <Typography className="content-info-text">
```

### Step 3: Remove sx Props
Keep only essential Material-UI props and move styling to CSS classes.

## Responsive Design
The CSS files include responsive breakpoints:
- Mobile: `max-width: 480px`
- Tablet: `max-width: 768px`
- Desktop: Default styles

## Color Scheme
- Primary: `#1e3a8a` (Dark Blue)
- Secondary: `#10b981` (Green)
- Text Primary: `#333`
- Text Secondary: `#666`
- Background: `#f8f9fa`
- Border: `#e0e0e0`
