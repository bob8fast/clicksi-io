# Setting Up Multiple Environments in Cloudflare Pages

This guide covers how to set up and manage multiple environments for your Clicksi platform (production, development, staging, testing) and how to configure regional domains.

## Part 1: Setting Up Multiple Environments in Cloudflare Pages

### 1.1 Understanding Cloudflare Pages Environments

Cloudflare Pages provides built-in support for different environments through:

1. **Production environment**: Your main domain (e.g., clicksi.io)
2. **Preview environments**: Automatically created for branch deployments
3. **Custom environments**: Created manually for specific purposes

Each environment can have:
- Its own domain/subdomain
- Unique environment variables
- Different build configurations

### 1.2 Setting Up Your Primary Production Environment

1. **Create the main Cloudflare Pages project**:
   - Log in to Cloudflare Dashboard → Pages → Create a project
   - Connect your Git repository (GitHub, GitLab, etc.)
   - Configure basic build settings:
     - Build command: `npm run build` (or your specific build command)
     - Build output directory: `.next` (for Next.js)
     - Root directory: `/` (or your specific project root)
   - Deploy the site

2. **Configure your production domain**:
   - Go to your Pages project → Custom domains → Set up a custom domain
   - Add your production domain (e.g., `clicksi.io`)
   - Follow the verification process
   - Ensure your domain's DNS is pointing to Cloudflare

### 1.3 Creating Multiple Environments with Branches

Cloudflare Pages automatically creates preview environments for each branch in your repository. You can leverage this for your different environments:

1. **Create environment-specific branches in your repository**:
   - `main` → Production (clicksi.io)
   - `development` → Development
   - `staging` → Staging
   - `testing` → Testing

2. **Configure preview deployments**:
   - Go to your Pages project → Settings → Builds & deployments
   - Under "Preview deployments", enable "Deploy all pushed branches"

3. **Set custom domains for each environment**:
   - Go to your Pages project → Custom domains
   - Add custom domains for each environment:
     - Production: `clicksi.io`
     - Development: `dev.clicksi.io`
     - Staging: `staging.clicksi.io`
     - Testing: `testing.clicksi.io`

4. **Configure environment-specific variables**:
   - Go to your Pages project → Settings → Environment variables
   - Add variables with different values for each environment
   - Select the specific environment (production, preview, or specific branch) when adding variables

### 1.4 Environment-Specific Config Using Advanced Branch Deployments

For more control over environments:

1. **Create specific production branches**:
   - Go to your Pages project → Settings → Builds & deployments
   - Under "Branch deployments", add specific branch deployments:
     - Add `development` branch → Set environment name as "development"
     - Add `staging` branch → Set environment name as "staging"
     - Add `testing` branch → Set environment name as "testing"

2. **Configure build settings per branch**:
   ```yaml
   # In your repository, create a .cloudflare/pages.yaml or wrangler.toml file:

   # Example wrangler.toml:
   [env.production]
   name = "clicksi-production"
   route = "clicksi.io/*"
   vars = { ENVIRONMENT = "production" }

   [env.development]
   name = "clicksi-development"
   route = "dev.clicksi.io/*"
   vars = { ENVIRONMENT = "development" }

   [env.staging]
   name = "clicksi-staging"
   route = "staging.clicksi.io/*"
   vars = { ENVIRONMENT = "staging" }

   [env.testing]
   name = "clicksi-testing"
   route = "testing.clicksi.io/*"
   vars = { ENVIRONMENT = "testing" }
   ```

### 1.5 Setting Up Environment Variables for Different Environments

1. **Go to your Pages project → Settings → Environment variables**

2. **Add common variables for all environments**:
   - Click "Add variable"
   - Enter name and value
   - Select "All environments" in the dropdown

3. **Add environment-specific variables**:
   - Click "Add variable"
   - Enter name and value
   - Select the specific environment (production or preview)
   - For branch-specific variables, select "Specific branch" and choose the branch

4. **Example variable structure**:

   | Variable Name | Environment | Value |
   |---------------|-------------|-------|
   | `NEXT_PUBLIC_API_URL` | Production | `https://api.clicksi.io` |
   | `NEXT_PUBLIC_API_URL` | Preview (development) | `https://dev-api.clicksi.io` |
   | `NEXT_PUBLIC_API_URL` | Preview (staging) | `https://staging-api.clicksi.io` |
   | `NEXT_PUBLIC_API_URL` | Preview (testing) | `https://testing-api.clicksi.io` |
   | `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | Production | `service_prod` |
   | `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | Preview (development) | `service_dev` |

### 1.6 Implementing Environment Detection in Your Code

Add logic to your Next.js application to detect and use the correct environment:

```javascript
// utils/environment.js
export const getEnvironment = () => {
  // Check for environment variables first
  if (process.env.NEXT_PUBLIC_ENVIRONMENT) {
    return process.env.NEXT_PUBLIC_ENVIRONMENT;
  }
  
  // Fall back to hostname detection (client-side only)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    if (hostname.includes('dev.')) return 'development';
    if (hostname.includes('staging.')) return 'staging';
    if (hostname.includes('testing.')) return 'testing';
    
    // Default to production for main domain
    return 'production';
  }
  
  // Server-side default
  return 'production';
};

export const getApiUrl = () => {
  const env = getEnvironment();
  
  switch (env) {
    case 'development':
      return 'https://dev-api.clicksi.io';
    case 'staging':
      return 'https://staging-api.clicksi.io';
    case 'testing':
      return 'https://testing-api.clicksi.io';
    default:
      return 'https://api.clicksi.io';
  }
};
```

## Part 2: Setting Up Regional Domains

### 2.1 Planning Your Regional Domain Strategy

For a platform like Clicksi targeting multiple regions, you have several options:

1. **Top-Level Domains (TLDs) for each region**:
   - `clicksi.io` (Global/International)
   - `clicksi.com.ua` (Ukraine)
   - `clicksi.pl` (Poland)
   - etc.

2. **Subdomain approach**:
   - `clicksi.io` (Global/International)
   - `ua.clicksi.io` (Ukraine)
   - `pl.clicksi.io` (Poland)
   - etc.

3. **Path-based approach**:
   - `clicksi.io` (Global/International)
   - `clicksi.io/ua` (Ukraine)
   - `clicksi.io/pl` (Poland)
   - etc.

### 2.2 Setting Up Regional Domains in Cloudflare

#### Option 1: Using Separate TLDs

1. **Register each regional domain**:
   - Register all the TLDs you need through Cloudflare or your preferred registrar
   - Transfer the domains to Cloudflare DNS management

2. **Add domains to your Pages project**:
   - Go to your Pages project → Custom domains
   - Add each regional domain (e.g., `clicksi.com.ua`, `clicksi.pl`)
   - Configure DNS settings as prompted

3. **Set up regional redirects using Cloudflare Workers**:
   - Create a Cloudflare Worker to handle region detection and redirects
   - Deploy the Worker to each of your domains

#### Option 2: Using Subdomains

1. **Configure your main domain in Cloudflare**:
   - Ensure your main domain (e.g., `clicksi.io`) is added to Cloudflare

2. **Add regional subdomains**:
   - Go to your Pages project → Custom domains
   - Add each regional subdomain (e.g., `ua.clicksi.io`, `pl.clicksi.io`)

3. **Set up DNS records**:
   - Add CNAME records for each subdomain pointing to your Cloudflare Pages URL

### 2.3 Implementing Regional Routing in Your Application

#### Using Next.js Middleware for Regional Routing

Create a middleware file to handle regional routing:

```javascript
// middleware.js
import { NextResponse } from 'next/server';

// Supported regions and their locales
const regions = {
  'ua': 'uk-UA',
  'pl': 'pl-PL',
  'default': 'en-US'
};

export function middleware(request) {
  const url = request.nextUrl.clone();
  
  // Get hostname (e.g., ua.clicksi.io)
  const hostname = request.headers.get('host');
  
  // Extract region from hostname
  let region = 'default';
  
  if (hostname.startsWith('ua.')) {
    region = 'ua';
  } else if (hostname.startsWith('pl.')) {
    region = 'pl';
  }
  
  // Set locale based on region
  const locale = regions[region] || regions.default;
  
  // Set cookies for client-side region detection
  const response = NextResponse.next();
  response.cookies.set('region', region);
  response.cookies.set('locale', locale);
  
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

#### Detecting Region in Your Components

```javascript
// hooks/useRegion.js
import { useState, useEffect } from 'react';
import { getCookie } from 'cookies-next';

export function useRegion() {
  const [region, setRegion] = useState('default');
  const [locale, setLocale] = useState('en-US');
  
  useEffect(() => {
    // Get region and locale from cookies (set by middleware)
    const regionCookie = getCookie('region');
    const localeCookie = getCookie('locale');
    
    if (regionCookie) setRegion(regionCookie);
    if (localeCookie) setLocale(localeCookie);
    
    // Fallback to hostname detection if cookies not available
    if (!regionCookie && typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      
      if (hostname.startsWith('ua.')) {
        setRegion('ua');
        setLocale('uk-UA');
      } else if (hostname.startsWith('pl.')) {
        setRegion('pl');
        setLocale('pl-PL');
      }
    }
  }, []);
  
  return { region, locale };
}
```

### 2.4 Setting Up Environment Variables for Different Regions

1. **Create region-specific branches**:
   - `main` → Global/International
   - `region-ua` → Ukraine
   - `region-pl` → Poland

2. **Configure region-specific environment variables**:
   - Go to your Pages project → Settings → Environment variables
   - Add variables with different values for each regional branch:

   | Variable Name | Branch | Value |
   |---------------|--------|-------|
   | `NEXT_PUBLIC_REGION` | main | `global` |
   | `NEXT_PUBLIC_REGION` | region-ua | `ua` |
   | `NEXT_PUBLIC_REGION` | region-pl | `pl` |
   | `NEXT_PUBLIC_API_ENDPOINT` | main | `https://api.clicksi.io` |
   | `NEXT_PUBLIC_API_ENDPOINT` | region-ua | `https://api.clicksi.io/ua` |
   | `NEXT_PUBLIC_API_ENDPOINT` | region-pl | `https://api.clicksi.io/pl` |

## Part 3: Advanced Multi-Region Setup with Cloudflare

### 3.1 Using Cloudflare Workers for Intelligent Routing

Cloudflare Workers can provide sophisticated routing based on user location:

1. **Create a Cloudflare Worker**:

```javascript
// worker.js
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // Get user country from Cloudflare header
  const country = request.headers.get('CF-IPCountry') || 'UNKNOWN'
  
  // Get hostname and URL
  const url = new URL(request.url)
  const hostname = url.hostname
  
  // Define region mappings
  const regionMap = {
    'UA': 'ua.clicksi.io',
    'PL': 'pl.clicksi.io',
    // Add more country codes as needed
  }
  
  // Check if we should redirect to a regional site
  if (regionMap[country] && !hostname.startsWith(country.toLowerCase() + '.')) {
    // Create redirect URL to the regional domain
    const newUrl = new URL(request.url)
    newUrl.hostname = regionMap[country]
    
    // Return HTTP 302 redirect
    return Response.redirect(newUrl.toString(), 302)
  }
  
  // Otherwise, pass the request through to the original target
  return fetch(request)
}
```

2. **Deploy the Worker**:
   - Go to Cloudflare Dashboard → Workers & Pages → Create a Worker
   - Paste the code and deploy
   - Set up a route for your worker (e.g., `clicksi.io/*`)

### 3.2 Content Delivery and Edge Caching

Optimize your regional deployments with Cloudflare's CDN:

1. **Configure Cache Rules**:
   - Go to Cloudflare Dashboard → Caching → Configuration
   - Create cache rules specific to your assets and static content
   - Consider different caching strategies for different regions

2. **Set up Page Rules for Regional Domains**:
   - Go to Cloudflare Dashboard → Rules → Page Rules
   - Create specific rules for regional domains
   - Example: `ua.clicksi.io/*` → Cache Level: Cache Everything

3. **Optimize Images and Assets**:
   - Enable Cloudflare's Polish and Mirage features for automatic image optimization
   - Use Cloudflare Images for region-specific image serving

### 3.3 Monitoring Regional Performance

1. **Set up Cloudflare Analytics**:
   - Go to Cloudflare Dashboard → Analytics → Traffic
   - Monitor traffic patterns by country and region

2. **Create Performance Alerts**:
   - Set up alerts for performance issues in specific regions
   - Monitor response times across different regional endpoints

3. **Use Web Analytics**:
   - Enable Cloudflare Web Analytics to track user behavior by region
   - Identify regional performance differences

## Part 4: Implementation Example for Clicksi

### 4.1 Complete Domain Structure

For Clicksi, we recommend the following structure:

**Production Environment:**
- Global: `clicksi.io`
- Ukraine: `ua.clicksi.io` or `clicksi.com.ua`
- Poland: `pl.clicksi.io` or `clicksi.pl`
- Add more regions as needed

**Development Environment:**
- Global: `dev.clicksi.io`
- Ukraine: `dev-ua.clicksi.io`
- Poland: `dev-pl.clicksi.io`

**Staging Environment:**
- Global: `staging.clicksi.io`
- Ukraine: `staging-ua.clicksi.io`
- Poland: `staging-pl.clicksi.io`

**Testing Environment:**
- Global: `testing.clicksi.io`
- Ukraine: `testing-ua.clicksi.io`
- Poland: `testing-pl.clicksi.io`

### 4.2 Environment Variable Structure

Create a comprehensive environment variable structure in Cloudflare Pages:

| Variable Name | Environment | Region | Value |
|---------------|-------------|--------|-------|
| `NEXT_PUBLIC_ENV` | Production | All | `production` |
| `NEXT_PUBLIC_ENV` | Preview (development) | All | `development` |
| `NEXT_PUBLIC_ENV` | Preview (staging) | All | `staging` |
| `NEXT_PUBLIC_ENV` | Preview (testing) | All | `testing` |
| `NEXT_PUBLIC_REGION` | All | Global | `global` |
| `NEXT_PUBLIC_REGION` | All | UA | `ua` |
| `NEXT_PUBLIC_REGION` | All | PL | `pl` |
| `NEXT_PUBLIC_API_URL` | Production | Global | `https://api.clicksi.io` |
| `NEXT_PUBLIC_API_URL` | Production | UA | `https://api.clicksi.io/ua` |
| `NEXT_PUBLIC_API_URL` | Development | Global | `https://dev-api.clicksi.io` |
| `NEXT_PUBLIC_API_URL` | Development | UA | `https://dev-api.clicksi.io/ua` |

### 4.3 Deployment Workflow

Implement a CI/CD workflow that handles your multi-environment, multi-region setup:

```yaml
# .github/workflows/deploy.yml
name: Deploy Clicksi

on:
  push:
    branches:
      - main
      - development
      - staging
      - testing
      - region-*

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set environment variables
        id: set-env
        run: |
          if [[ $GITHUB_REF == "refs/heads/main" ]]; then
            echo "::set-output name=environment::production"
          elif [[ $GITHUB_REF == "refs/heads/development" ]]; then
            echo "::set-output name=environment::development"
          elif [[ $GITHUB_REF == "refs/heads/staging" ]]; then
            echo "::set-output name=environment::staging"
          elif [[ $GITHUB_REF == "refs/heads/testing" ]]; then
            echo "::set-output name=environment::testing"
          elif [[ $GITHUB_REF == *"region-"* ]]; then
            echo "::set-output name=environment::region"
            echo "::set-output name=region::${GITHUB_REF#refs/heads/region-}"
          fi
      
      # Add your build and deploy steps here
      # Use ${{ steps.set-env.outputs.environment }} and ${{ steps.set-env.outputs.region }}
```

## Part 5: Best Practices and Considerations

### 5.1 SEO Considerations for Multiple Domains

1. **Implement hreflang tags** to indicate regional versions:
   ```html
   <link rel="alternate" hreflang="en" href="https://clicksi.io" />
   <link rel="alternate" hreflang="uk" href="https://ua.clicksi.io" />
   <link rel="alternate" hreflang="pl" href="https://pl.clicksi.io" />
   ```

2. **Set canonical URLs** properly across regional domains

3. **Use appropriate language meta tags**:
   ```html
   <meta property="og:locale" content="uk_UA" />
   ```

### 5.2 Testing Regional Deployments

1. **Use Cloudflare's Preview environments** to test regional changes

2. **Test with proxies or VPNs** to verify region-specific behavior

3. **Set up automated tests** for each region and environment

### 5.3 Scaling Your Regional Strategy

As Clicksi grows, consider:

1. **Dynamic region detection** instead of hardcoded regions

2. **Content localization pipeline** for efficient translations

3. **Regional feature flags** to roll out features by region

4. **Local compliance features** for region-specific legal requirements

### 5.4 Cost Management

1. **Monitor usage across regions** to optimize spending

2. **Consider separate Worker usage** per region for detailed billing

3. **Implement tiered caching strategies** based on regional traffic patterns

## Conclusion

This multi-environment, multi-region setup gives Clicksi a solid foundation for global expansion while maintaining the ability to customize content and features for specific markets. The architecture is scalable and leverages Cloudflare's global network for optimal performance across all regions.
