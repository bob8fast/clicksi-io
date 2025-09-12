# Clicksi Subscription Management System

A comprehensive subscription management system for the Clicksi platform, supporting both Brand and Retailer subscription plans with feature-based permissions and usage tracking.

## 📁 File Structure

```
app/
├── subscription/
│   ├── page.tsx                    # Subscription plans page
│   ├── checkout/page.tsx           # Payment and checkout flow
│   ├── manage/page.tsx             # Subscription management
│   ├── payments/page.tsx           # Payment history
│   ├── trial/page.tsx              # Trial request form
│   └── success/page.tsx            # Post-checkout success page
├── admin/
│   ├── subscriptions/page.tsx      # Admin plan management
│   └── trial-requests/page.tsx     # Admin trial management
└── dashboard/
    └── subscription-overview/page.tsx  # Dashboard overview

components/
├── subscription/
│   ├── PermissionGuard.tsx         # Feature access control
│   └── FeatureNotIncluded.tsx      # Upgrade prompt component
└── examples/
    └── SubscriptionExamples.tsx    # Usage examples

hooks/
└── subscription-hooks.ts           # React Query hooks

services/
└── subscription-service.ts         # API service layer

types/
└── subscription.ts                 # TypeScript types

utils/
└── subscription-utils.ts           # Utility functions
```

## 🚀 Quick Start

### 1. Install Dependencies

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

### 3. Initialize React Query

```tsx
// app/layout.tsx
import QueryProvider from '@/providers/query-provider';

export default function Layout({ children }) {
  return (
    <QueryProvider>
      {children}
    </QueryProvider>
  );
}
```

## 🎯 Core Features

### Subscription Plans
- ✅ Brand and Retailer specific plans
- ✅ Multiple tiers (Basic, Standard, Premium, Enterprise)
- ✅ Monthly and yearly billing cycles
- ✅ Free trial periods
- ✅ Feature-based permissions

### Permission System
- ✅ Feature-based access control
- ✅ Usage limits and tracking
- ✅ Soft and hard permission guards
- ✅ Automatic upgrade prompts

### Admin Management
- ✅ Plan creation and editing
- ✅ Trial request management
- ✅ User subscription overview
- ✅ Usage analytics

### Payment Processing
- ✅ Stripe integration (mock)
- ✅ PayPal support (mock)
- ✅ Payment history tracking
- ✅ Invoice generation

## 📋 Usage Examples

### Basic Permission Guard

```tsx
import { PermissionGuard } from '@/components/subscription/PermissionGuard';

function AnalyticsPage() {
  return (
    <PermissionGuard feature="analytics">
      <div>
        <h1>Analytics Dashboard</h1>
        {/* Analytics content only visible to users with analytics access */}
      </div>
    </PermissionGuard>
  );
}
```

### Feature Button

```tsx
import { FeatureButton } from '@/components/subscription/PermissionGuard';

function ActionBar() {
  return (
    <FeatureButton
      feature="apiAccess"
      onClick={() => openApiSettings()}
      className="bg-blue-500 text-white"
    >
      API Settings
    </FeatureButton>
  );
}
```

### Usage Tracking

```tsx
import { UsageMeter } from '@/components/subscription/PermissionGuard';

function Dashboard() {
  return (
    <div>
      <UsageMeter feature="connections" showUpgradeWhen={80} />
      <UsageMeter feature="invites" showUpgradeWhen={90} />
    </div>
  );
}
```

### Custom Permission Check

```tsx
import { useSubscriptionPermissions } from '@/hooks/subscription-hooks';

function MyComponent() {
  const analyticsPermission = useSubscriptionPermissions('analytics');
  
  if (!analyticsPermission.hasAccess) {
    return <div>Analytics not available in your plan</div>;
  }
  
  return <AnalyticsChart />;
}
```

## 🔧 Configuration

### Plan Configuration

```typescript
// Define your subscription plans
const plans: SubscriptionPlan[] = [
  {
    id: 'brand-basic',
    name: 'Basic',
    businessType: 'Brand',
    price: { monthly: 49, yearly: 490 },
    features: {
      maxConnections: 5,
      maxInvites: 10,
      analytics: true,
      prioritySupport: false,
      customBranding: false,
      apiAccess: false,
      // ... other features
    },
    description: 'Perfect for small brands',
    trialDays: 14,
  },
  // ... more plans
];
```

### Feature Permissions

```typescript
// Check specific features
const permissions = {
  analytics: 'Basic',      // Available from Basic plan
  apiAccess: 'Premium',    // Requires Premium or higher
  whiteLabel: 'Enterprise' // Enterprise only
};
```

## 🎨 Component API

### PermissionGuard

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `feature` | `FeatureKey` | required | Feature to check access for |
| `children` | `ReactNode` | required | Content to show when access is granted |
| `fallback` | `ReactNode` | `undefined` | Custom fallback component |
| `showUpgradePrompt` | `boolean` | `true` | Whether to show upgrade prompt |
| `requirementLevel` | `'soft' \| 'hard'` | `'hard'` | Soft shows warning, hard blocks access |
| `onUpgrade` | `() => void` | `undefined` | Custom upgrade handler |

### FeatureButton

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `feature` | `FeatureKey` | required | Feature to check |
| `onClick` | `() => void` | required | Click handler (only called if access granted) |
| `children` | `ReactNode` | required | Button content |
| `disabled` | `boolean` | `false` | Additional disabled state |

### UsageMeter

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `feature` | `'connections' \| 'invites'` | required | Usage metric to display |
| `showUpgradeWhen` | `number` | `80` | Percentage threshold for upgrade prompt |

## 🔄 State Management

The system uses React Query for server state and includes optimistic updates:

```typescript
// Subscribe to a plan
const subscribeToPlan = useSubscribeToPlan();

const handleSubscribe = async () => {
  await subscribeToPlan.mutateAsync({
    planId: 'brand-premium',
    paymentMethodId: 'pm_123',
    billingCycle: 'monthly'
  });
};

// Cancel subscription
const cancelSubscription = useCancelSubscription();

const handleCancel = async () => {
  await cancelSubscription.mutateAsync(subscriptionId);
};
```

## 🛠️ Customization

### Custom Feature Guard

```tsx
function CustomFeatureGuard({ children }) {
  const permissions = useSubscriptionPermissions('customFeature');
  
  if (!permissions.hasAccess) {
    return <CustomUpgradePrompt />;
  }
  
  return children;
}
```

### Custom Usage Component

```tsx
function CustomUsageDisplay() {
  const { data: usage } = useCurrentUsage(userId);
  const { data: subscription } = useUserSubscription(userId);
  
  const connectionsUsed = usage?.connections || 0;
  const connectionsLimit = subscription?.plan.features.maxConnections || 0;
  
  return (
    <div>
      <p>Connections: {connectionsUsed} / {connectionsLimit}</p>
      {/* Custom usage visualization */}
    </div>
  );
}
```

## 🎯 Business Rules

### Plan Limits

| Feature | Basic | Standard | Premium | Enterprise |
|---------|-------|----------|---------|------------|
| **Brands** |
| Connections | 5 | 15 | 50 | Unlimited |
| Monthly Invites | 10 | 30 | 100 | Unlimited |
| Analytics | ✅ | ✅ | ✅ | ✅ |
| Priority Support | ❌ | ✅ | ✅ | ✅ |
| API Access | ❌ | ❌ | ✅ | ✅ |
| Custom Branding | ❌ | ✅ | ✅ | ✅ |
| **Retailers** |
| Connections | 3 | 10 | 25 | Unlimited |
| Monthly Invites | 5 | 20 | 50 | Unlimited |
| Analytics | ✅ | ✅ | ✅ | ✅ |

### Trial Periods

- Basic/Standard: 14 days
- Premium: 14 days  
- Enterprise: 30 days

### Billing Cycles

- Monthly billing: Charged every 30 days
- Yearly billing: ~17% savings on average
- Pro-rated upgrades/downgrades

## 🔐 Security Considerations

### Permission Checks

```typescript
// Always verify permissions server-side
export async function checkFeatureAccess(userId: string, feature: string) {
  const subscription = await getUserSubscription(userId);
  return subscription?.plan.features[feature] === true;
}

// Client-side checks are for UX only
const permissions = useSubscriptionPermissions('analytics');
// Still need server-side validation for API calls
```

### Payment Security

- Never store payment details client-side
- Use Stripe/PayPal secure tokenization
- Validate all subscription changes server-side
- Implement proper webhook handling

## 📊 Analytics & Monitoring

### Track Usage Metrics

```typescript
// Track feature usage
analytics.track('feature_used', {
  feature: 'analytics',
  userId,
  planType: subscription.plan.name
});

// Track upgrade events
analytics.track('subscription_upgraded', {
  fromPlan: oldPlan.name,
  toPlan: newPlan.name,
  userId
});
```

### Monitor Subscription Health

- Track trial conversion rates
- Monitor churn by plan type
- Analyze feature adoption
- Track upgrade/downgrade patterns

## 🚀 Deployment

### Environment Setup

```bash
# Production
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Database
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
```

### Database Migration

```sql
-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  plan_id VARCHAR(50),
  status VARCHAR(20),
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  trial_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Usage tracking
CREATE TABLE usage_tracking (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  feature VARCHAR(50),
  count INTEGER DEFAULT 0,
  period_start TIMESTAMP,
  period_end TIMESTAMP
);
```

## 🤝 Contributing

1. Follow the existing component patterns
2. Add proper TypeScript types
3. Include permission guards for new features
4. Update usage tracking for metered features
5. Add tests for subscription logic
6. Document new features in this README

## 📝 Testing

```typescript
// Test permission guards
test('PermissionGuard blocks access for insufficient permissions', () => {
  const mockPermissions = { hasAccess: false, upgradeRequired: true };
  // ... test implementation
});

// Test subscription hooks
test('useSubscriptionPermissions returns correct access status', () => {
  // ... test implementation
});
```

## 🐛 Troubleshooting

### Common Issues

1. **Permission Guard not updating**: Check React Query cache invalidation
2. **Usage not tracking**: Verify usage service endpoints
3. **Payment failures**: Check Stripe webhook configuration
4. **Trial not expiring**: Verify background job processing

### Debug Mode

```typescript
// Enable debug logging
const DEBUG_SUBSCRIPTIONS = process.env.NODE_ENV === 'development';

if (DEBUG_SUBSCRIPTIONS) {
  console.log('Subscription check:', { feature, hasAccess, currentPlan });
}
```

---

For more details, see the individual component documentation and the live examples at `/dashboard/subscription-overview`.