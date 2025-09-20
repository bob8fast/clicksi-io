import { lazy } from 'react'

// Map of legal page slugs to their static components (English only for now)
const legalComponents = {
  'privacy-policy': lazy(() => import('@/components/legal/PrivacyPolicyPage').then(m => ({ default: m.default }))),
  'terms-of-service': lazy(() => import('@/components/legal/TermsOfServicePage').then(m => ({ default: m.default }))),
  'cookie-policy': lazy(() => import('@/components/legal/CookiePolicyPage').then(m => ({ default: m.default }))),
}

export function isLegalPage(slug: string): boolean {
  return slug in legalComponents
}

export function getLegalComponent(slug: string, locale: string = 'en') {
  // For now, all legal pages fallback to English
  // This can be extended in the future when locale-specific components are created
  return legalComponents[slug as keyof typeof legalComponents]
}