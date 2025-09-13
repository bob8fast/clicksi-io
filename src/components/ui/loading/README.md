# Loading Components Documentation

This directory contains all loading state components and skeleton loaders for the Clicksi web platform.

## 📁 Directory Structure

```
src/components/ui/loading/
├── shared/                    # Reusable skeleton components
├── [Component]Skeleton.tsx    # Page-specific skeleton loaders
├── loading-state.tsx          # General loading utilities
└── README.md                  # This documentation
```

## 🧩 Core Loading Components

### **General Loading States**

#### `LoadingState`
**Location**: `loading-state.tsx`
**Purpose**: Main loading state component with animated spinner and dark theme design
**Variants**: Small, medium, large sizes with optional full-screen mode

#### `LoadingSpinner` 
**Location**: `loading-state.tsx`
**Purpose**: Simple loading spinner component for inline usage

#### `NavigationSkeleton`
**Location**: `loading-state.tsx` 
**Purpose**: Navigation skeleton loader for menu items

## 🔄 Shared Skeleton Components

**Location**: `shared/` directory

### **Layout Components**

#### `HeaderSkeleton`
**Purpose**: Reusable page header skeleton with optional actions, subtitles, and badges
**Configuration**: `showActions`, `showSubtitle`, `showBadges`

#### `GridSkeleton`
**Purpose**: Flexible grid layout skeleton with configurable columns and custom item components
**Variants**: `ListSkeleton`, `CardGridSkeleton`, `CompactGridSkeleton`
**Configuration**: `itemCount`, `columns`, `itemComponent`, `showPagination`

#### `CardSkeleton`
**Purpose**: Generic card skeleton with configurable header, content, and footer sections
**Configuration**: `showHeader`, `showFooter`, `contentLines`, `headerLines`, `footerContent`

### **Form & Input Components**

#### `FormSkeleton`
**Purpose**: Advanced form section skeleton with different field types
**Variants**: `BasicFormSkeleton`, `AdvancedFormSkeleton`
**Field Types**: `input`, `textarea`, `select`, `date`, `checkbox-group`, `grid`
**Configuration**: `title`, `description`, `fields`, `showActions`

#### `FiltersSkeleton`
**Purpose**: Search and filter section skeleton with checkbox groups
**Variants**: `SimpleFiltersSkeleton`, `AdvancedFiltersSkeleton`
**Configuration**: `showActiveFilters`, `filterCount`, `showCheckboxes`, `showSearchBar`

## 📄 Page-Specific Skeleton Components

### **Content Pages**

#### `CreatorListSkeleton`
**Purpose**: Creator discovery page loading with sidebar filters and creator cards
**Features**: Sidebar filters, responsive grid, creator card placeholders

#### `CreatorPageSkeleton`
**Purpose**: Individual creator profile page loading
**Features**: Cover photo, avatar, stats, bio, collections, posts

#### `ProductListSkeleton`
**Purpose**: Product catalog page loading with filters and product grid
**Features**: Sidebar filters, responsive product grid, product card placeholders

#### `ProductDetailsSkeleton`
**Purpose**: Individual product page loading
**Features**: Product images, brand info, pricing, action buttons

### **Management Pages**

#### `IntegrationsLoadingSkeleton`
**Purpose**: Social media integrations page loading
**Features**: Connected accounts, available platforms, connection status

### **Commission System**

#### `CommissionRuleListSkeleton`
**Purpose**: Commission rules management page loading
**Features**: Header, filters, rule cards grid, pagination, conflict alerts

#### `CommissionRuleDetailSkeleton`
**Purpose**: Individual commission rule details loading
**Features**: Rule header, formula display, detail cards, metadata

#### `CommissionFormSkeleton`
**Purpose**: Commission rule creation/editing form loading
**Features**: Multi-section form with basic info, formula config, limits, restrictions

#### `CommissionMetricsSkeleton`
**Purpose**: Commission analytics dashboard loading
**Modes**: Compact (4 key metrics), Full (dashboard with top performers, summaries)

#### `FormulaEditorSkeleton`
**Purpose**: Advanced formula editor interface loading
**Features**: Expression editor, validation area, test runner, examples, keywords helper

## 🎨 Design System

### **Theme Consistency**
- All skeletons use shadcn `Skeleton` component for consistent theming
- Supports light/dark mode through CSS variables
- Uses platform color palette: `#202020`, `#171717`, `#090909`

### **Animation Standards**
- Standard pulse animation for skeleton states
- Custom spinners for active loading states
- Consistent border radius and spacing

### **Responsive Design**
- Mobile-first approach with responsive breakpoints
- Touch-friendly sizing and spacing
- Adaptive layouts for different screen sizes

## 🔧 Technical Implementation

### **Architecture**
- Built on shadcn/ui `Skeleton` component
- TypeScript interfaces for all props
- Configurable component patterns for maximum reusability
- Proper imports and exports structure

### **Performance**
- Optimized rendering with React patterns
- Minimal DOM elements for skeleton states
- Efficient CSS animations
- Proper component composition

### **Accessibility**
- Screen reader compatible skeleton patterns
- Proper ARIA labels where needed
- Consistent loading state announcements
- Keyboard navigation support where applicable

---

## 📚 Usage Guidelines

1. **Use shared components** when possible instead of creating custom skeletons
2. **Match skeleton structure** to actual content layout for better UX
3. **Configure components** using provided props rather than custom styling
4. **Maintain consistency** with existing skeleton patterns
5. **Test responsiveness** across different screen sizes

## 🔄 Recent Updates

- **Skeleton Refactoring (2025-08)**: Complete migration to shadcn Skeleton component
- **Shared Components**: Created 5 reusable skeleton patterns
- **Code Cleanup**: Removed 100+ hardcoded skeleton classes
- **Performance**: Optimized skeleton rendering across all components