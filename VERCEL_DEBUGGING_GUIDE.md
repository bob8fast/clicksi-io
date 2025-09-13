# 🔍 Vercel Dynamic Rendering Debug Guide

## ✅ Fixes Applied for Dynamic Rendering

### 1. **Build-Time Database Access Fixed**
- **Problem**: `generateStaticParams()` tried to access database during build
- **Solution**: Skip static generation on Vercel, use dynamic rendering
- **File**: `src/app/[slug]/page.tsx:17-33`

### 2. **Base URL Resolution Fixed**
- **Problem**: API calls failed due to incorrect URL resolution
- **Solution**: Added Vercel URL detection with proper fallbacks
- **File**: `src/lib/api-client.ts:4-21`

### 3. **Dynamic Configuration Added**
- **Problem**: ISR conflicted with dynamic database content
- **Solution**: Added `export const dynamic = 'auto'` for flexible rendering
- **File**: `src/app/[slug]/page.tsx:15`

### 4. **Enhanced Logging Added**
- **Problem**: Hard to debug issues on Vercel
- **Solution**: Added comprehensive logging for API calls and database operations
- **Files**: `src/lib/api-client.ts` and `src/lib/db.ts`

## 🕵️ Where to Look for Issues

### 1. **Vercel Function Logs**
```
1. Go to Vercel Dashboard
2. Click your project
3. Go to "Functions" tab
4. Click on any function to see logs
5. Look for [API], [DB], or [BUILD] prefixed messages
```

### 2. **Build Logs**
```
1. Go to Vercel Dashboard
2. Click your project
3. Go to "Deployments" tab
4. Click on latest deployment
5. Check "Build Logs" section
```

### 3. **Runtime Logs**
```
1. In Vercel Dashboard
2. Go to "Functions" tab
3. Click on specific function (e.g., /api/dynamic-pages)
4. Check real-time logs as users access your site
```

## 🐛 Common Issues & Solutions

### Issue 1: "Failed to fetch page data"
**Symptoms:**
- Pages show 404 or loading errors
- API calls return 500 errors

**Debug Steps:**
1. Check Function Logs for `[API]` messages
2. Verify `DATABASE_PAGES_URL` in Environment Variables
3. Test API endpoint directly: `https://your-site.vercel.app/api/dynamic-pages?slug=test-page`

**Logs to Look For:**
```
[API] Fetching page data for slug: test-page from https://your-site.vercel.app
[API] Response status: 200
[DB] Fetching page by slug: test-page
[DB] Query result: 1 rows found
```

### Issue 2: "Module not found" or Build Failures
**Symptoms:**
- Build fails during deployment
- Edge Runtime errors

**Debug Steps:**
1. Check Build Logs for specific error messages
2. Verify `export const runtime = 'nodejs'` in API routes
3. Check that `pg` is in dependencies (not devDependencies)

### Issue 3: Database Connection Timeout
**Symptoms:**
- API calls timeout after 10-30 seconds
- Database connection errors in logs

**Debug Steps:**
1. Check Function Logs for `[DB]` error messages
2. Verify Supabase allows external connections
3. Test connection string in Supabase SQL Editor

**Expected Logs:**
```
[DB] PostgreSQL pool error: connection timeout
[DB] Error fetching page by slug "test": Failed to fetch page
```

### Issue 4: Static Generation vs Dynamic Rendering
**Symptoms:**
- Pages don't update with new database content
- Build fails with database access errors

**Debug Steps:**
1. Check Build Logs for `[BUILD]` messages
2. Verify `generateStaticParams()` skips database calls on Vercel
3. Confirm `export const dynamic = 'auto'` is present

**Expected Build Logs:**
```
[BUILD] Skipping static param generation on Vercel - using dynamic rendering
```

## 🔧 Testing Your Deployment

### 1. **Test API Endpoints**
```bash
# Test page fetching
curl https://your-site.vercel.app/api/dynamic-pages?slug=test-page

# Expected: 200 response with page data
# Error: 404 or 500 with error message
```

### 2. **Test Dynamic Pages**
```bash
# Test dynamic page rendering
curl https://your-site.vercel.app/test-page

# Expected: Full HTML page with content from database
# Error: 404 or error page
```

### 3. **Test Database Connection**
```bash
# Test all pages endpoint
curl https://your-site.vercel.app/api/dynamic-pages?status=published

# Expected: Array of published pages
# Error: Empty array [] or error response
```

## 📊 Environment Variables Checklist

### Required in Vercel Dashboard:
- ✅ `DATABASE_PAGES_URL` - Your Supabase connection string
- ✅ Available in: Production, Preview, Development

### Auto-Provided by Vercel:
- ✅ `VERCEL` - Set to "1" on Vercel
- ✅ `VERCEL_URL` - Your deployment URL
- ✅ `NODE_ENV` - Set to "production" in production

## 🚀 Performance Monitoring

### Key Metrics to Watch:
1. **Function Duration** - Should be under 10 seconds
2. **Database Query Time** - Should be under 2 seconds
3. **Cache Hit Rate** - ISR should cache responses for 24 hours
4. **Memory Usage** - Functions should stay under 512MB

### Optimization Tips:
- Database queries are optimized for single connections
- API responses are cached with ISR
- Error handling prevents crashes
- Logging helps identify bottlenecks

## 🆘 Emergency Debugging

### If Everything Is Broken:

1. **Check Environment Variables**
   - Ensure `DATABASE_PAGES_URL` is correctly set
   - Redeploy after adding/changing variables

2. **Test Direct Database Access**
   - Connect to Supabase directly
   - Run: `SELECT * FROM pages LIMIT 1;`

3. **Check API Route Manually**
   - Visit: `https://your-site.vercel.app/api/dynamic-pages`
   - Should return array of pages or error message

4. **Review Recent Changes**
   - Check recent commits for configuration changes
   - Revert to last working deployment if needed

### Quick Rollback:
```bash
# In Vercel Dashboard
1. Go to "Deployments"
2. Find last working deployment
3. Click "Promote to Production"
```

## 📝 Log Examples

### ✅ Successful Page Load:
```
[API] Fetching page data for slug: about-us from https://your-site.vercel.app
[API] Response status: 200
[API] Successfully fetched page: About Us
[DB] Fetching page by slug: about-us
[DB] Query result: 1 rows found
```

### ❌ Failed Database Connection:
```
[DB] Error fetching page by slug "about-us": Error: connect ECONNREFUSED
[DB] Error message: connection timeout
[API] Failed to fetch page data: 500 - Internal Server Error
```

### ⚠️ Build Time Fallback:
```
[BUILD] Skipping static param generation on Vercel - using dynamic rendering
[BUILD] Error generating static params, falling back to dynamic rendering: Error: fetch failed
```

Your dynamic rendering should now work properly on Vercel! 🎉