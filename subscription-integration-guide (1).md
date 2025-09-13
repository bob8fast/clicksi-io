# 🚀 Clicksi Subscription System - Integration Guide

## ✅ Complete Feature Overview

Your Clicksi subscription management system includes:

### 📋 Core Pages
- ✅ **Subscription Plans Page** (`/subscription`) - Compare Brand vs Retailer plans
- ✅ **Checkout Flow** (`/subscription/checkout`) - Stripe/PayPal payment processing
- ✅ **Subscription Management** (`/subscription/manage`) - Current plan overview & changes
- ✅ **Payment History** (`/subscription/payments`) - All transactions with filtering
- ✅ **Trial Request** (`/subscription/trial`) - Request free trials with approval workflow
- ✅ **Success Page** (`/subscription/success`) - Post-purchase onboarding

### 🔐 Admin Features  
- ✅ **Admin Plan Management** (`/admin/subscriptions`) - Create/edit subscription plans
- ✅ **Trial Approval System** (`/admin/trial-requests`) - Review and approve trials
- ✅ **Rich Text Editor** - For plan descriptions and admin notes

### 🛡️ Permission System
- ✅ **Permission Guards** - Feature-level access control
- ✅ **Usage Tracking** - Monitor connections, invites, API calls
- ✅ **Route Protection** - Page-level subscription requirements
- ✅ **Soft/Hard Limits** - Graceful degradation vs blocking

### 💳 Payment Processing
- ✅ **Mock Stripe Integration** - Credit card processing
- ✅ **Mock PayPal Support** - Alternative payment method
- ✅ **Invoice Generation** - PDF receipts and billing
- ✅ **Campaign Payments** - Pre/post funding support

## 🔧 Quick Integration Steps

### 1. Add Required Dependencies

```bash
npm install @tanstack/react-query zustand @hookform/resolvers zod
```

### 2. Set Up Environment Variables

```bash
# .env.local
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
```

### 3. Update Your Layout

```tsx
// app/layout.tsx
import QueryProvider from '@/providers/query-provider';

export default function Layout({ children }) {
  return (
    <QueryProvider>
      <AuthSessionProvider>
        {children}
      </AuthSessionProvider>
    </QueryProvider>
  );
}
```

### 4. Protect Routes with Permissions

```tsx
// app/analytics/page.tsx
import { PermissionGuard } from '@/components/subscription/PermissionGuard';

export default function AnalyticsPage() {
  return (
    <PermissionGuard feature="analytics">
      <div>Your analytics content here</div>
    </PermissionGuard>
  );
}
```

### 5. Add Usage Tracking

```tsx
// components/dashboard/DashboardOverview.tsx
import { UsageMeter } from '@/components/subscription/PermissionGuard';

export default function Dashboard() {
  return (
    <div>
      <UsageMeter feature="connections" showUpgradeWhen={80} />
      <UsageMeter feature="invites" showUpgradeWhen={90} />
    </div>
  );
}
```

## 🎯 Business Rules Configuration

### Plan Structure
```typescript
// Brand Plans: Basic ($49) → Standard ($99) → Premium ($199) → Enterprise ($499)
// Retailer Plans: Basic ($39) → Standard ($79) → Premium ($149) → Enterprise ($299)

const planFeatures = {
  Basic: { connections: 5, invites: 10, analytics: true },
  Standard: { connections: 15, invites: 30, prioritySupport: true },
  Premium: { connections: 50, invites: 100, apiAccess: true },
  Enterprise: { connections: -1, invites: -1, whiteLabel: true }
};
```

### Permission Mapping
```typescript
const featureRequirements = {
  'analytics': 'Basic',
  'prioritySupport': 'Standard', 
  'customBranding': 'Standard',
  'apiAccess': 'Premium',
  'whiteLabel': 'Enterprise',
  'dedicatedManager': 'Enterprise'
};
```

## 📱 Component Usage Examples

### Basic Permission Check
```tsx
import { useSubscriptionPermissions } from '@/hooks/subscription-hooks';

function MyComponent() {
  const permissions = useSubscriptionPermissions('analytics');
  
  if (!permissions.hasAccess) {
    return <UpgradePrompt />;
  }
  
  return <AnalyticsChart />;
}
```

### Feature Button with Auto-Disable
```tsx
import { FeatureButton } from '@/components/subscription/PermissionGuard';

<FeatureButton
  feature="apiAccess"
  onClick={() => openApiSettings()}
  className="bg-blue-500 text-white"
>
  API Settings
</FeatureButton>
```

### Usage Meter with Upgrade Prompt
```tsx
import { UsageMeter } from '@/components/subscription/PermissionGuard';

<UsageMeter 
  feature="connections" 
  showUpgradeWhen={75} // Show upgrade at 75% usage
/>
```

### Route-Level Protection
```tsx
import RoutePermissionWrapper from '@/components/subscription/RoutePermissionWrapper';

export default function PremiumPage() {
  return (
    <RoutePermissionWrapper requiredFeature="apiAccess">
      <div>Premium content here</div>
    </RoutePermissionWrapper>
  );
}
```

## 🔄 State Management Flow

```
User subscribes → 
  Payment processed → 
    Subscription activated → 
      Permission cache updated → 
        UI components auto-update
```

The system uses React Query for:
- ✅ Automatic cache invalidation
- ✅ Optimistic updates
- ✅ Background refetching
- ✅ Error handling and retries

## 🎨 Theming & Dark Mode

All components follow your existing design system:
```scss
// CSS Variables used throughout
--color-primary: #171717;     // Dark backgrounds
--color-secondary: #090909;   // Darker backgrounds  
--color-light: #EDECF8;       // Light text
--color-orange: #D78E59;      // Brand accent
--color-orange-light: #FFAA6C; // Secondary accent
```

## 📊 Analytics & Monitoring

Track key metrics:
```typescript
// User engagement
analytics.track('feature_accessed', { feature, plan, userId });

// Subscription events  
analytics.track('subscription_upgraded', { fromPlan, toPlan });

// Usage patterns
analytics.track('usage_limit_reached', { feature, limit, userId });
```

## 🔐 Security Considerations

### Client-Side
- ✅ Permission checks for UX only
- ✅ No sensitive data in localStorage
- ✅ Secure token handling

### Server-Side (Implementation Required)
- ⚠️ Always verify permissions on API endpoints
- ⚠️ Validate subscription status server-side
- ⚠️ Rate limiting based on plan limits
- ⚠️ Webhook verification for payments

## 🚀 Production Deployment

### Required Environment Variables
```bash
# Payment Processing
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
PAYPAL_CLIENT_SECRET=...

# Database
DATABASE_URL=postgresql://...
REDIS_URL=redis://... # For caching

# Features
NEXT_PUBLIC_API_BASE_URL=https://api.clicksi.io
```

### Database Schema
```sql
-- Core subscription tables needed
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  plan_id VARCHAR(50),
  status VARCHAR(20),
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  trial_end TIMESTAMP
);

CREATE TABLE usage_tracking (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  feature VARCHAR(50),
  count INTEGER,
  period_start TIMESTAMP
);
```

## 🧪 Testing Strategy

### Component Testing
```typescript
// Test permission guards
test('blocks access for insufficient permissions', () => {
  render(<PermissionGuard feature="analytics">Content</PermissionGuard>);
  expect(screen.getByText('Upgrade')).toBeInTheDocument();
});

// Test usage meters  
test('shows upgrade prompt at threshold', () => {
  mockUsage({ connections: 8, limit: 10 }); // 80% usage
  render(<UsageMeter feature="connections" showUpgradeWhen={75} />);
  expect(screen.getByText('Upgrade')).toBeInTheDocument();
});
```

### Integration Testing
```typescript
// Test subscription flow
test('complete subscription journey', async () => {
  await selectPlan('premium');
  await enterPaymentDetails();
  await submitPayment();
  expect(await screen.findByText('Welcome')).toBeInTheDocument();
});
```

## 🐛 Common Issues & Solutions

### Permission Not Updating
```typescript
// Force refresh permissions after subscription change
queryClient.invalidateQueries(['subscriptions']);
```

### Usage Not Tracking
```typescript
// Ensure usage updates after actions
const incrementUsage = async (feature: string) => {
  await incrementFeatureUsage(feature);
  queryClient.invalidateQueries(['usage', userId]);
};
```

### Payment Webhook Failures
```typescript
// Implement retry logic for webhook processing
const processWebhook = async (event) => {
  try {
    await updateSubscription(event.data);
  } catch (error) {
    // Retry with exponential backoff
    await scheduleRetry(event, attempt + 1);
  }
};
```

## 📞 Support & Maintenance

### Monitoring Checklist
- [ ] Subscription status accuracy
- [ ] Payment webhook reliability  
- [ ] Permission cache performance
- [ ] Usage tracking accuracy
- [ ] Trial conversion rates

### User Support
- [ ] Clear upgrade paths in UI
- [ ] Helpful error messages
- [ ] Easy plan comparison
- [ ] Transparent pricing
- [ ] Responsive billing support

---

🎉 **Your subscription system is now ready!** The modular design makes it easy to extend with new features, plans, and payment methods as your business grows.

For detailed component APIs and advanced usage, see the [Complete Documentation](subscription-system-readme.md).