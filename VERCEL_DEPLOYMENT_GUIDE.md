# Vercel Deployment Guide for Database Integration

## ✅ Changes Made for Vercel Compatibility

### 1. Database Connection Pool Optimization
- **File**: `src/lib/db.ts`
- **Changes**:
  - Optimized connection pool for serverless environment
  - Single connection for Vercel (`max: 1`)
  - Increased timeouts for serverless cold starts
  - Added SSL configuration for production
  - Added graceful shutdown handling

### 2. API Route Configuration
- **File**: `src/app/api/dynamic-pages/route.ts`
- **Changes**:
  - Added `export const runtime = 'nodejs'` to force Node.js runtime
  - Prevents Edge Runtime issues with PostgreSQL

### 3. Vercel Configuration
- **File**: `vercel.json`
- **Changes**:
  - Force Node.js 20.x runtime for all API functions
  - Environment variable reference configuration

### 4. Enhanced Error Handling
- **File**: `src/lib/db.ts`
- **Changes**:
  - Better error logging with detailed messages
  - Graceful degradation (return null instead of throwing)
  - Database connection debugging logs

## 🚀 Deployment Checklist

### Step 1: Environment Variables in Vercel
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variable:
   ```
   Name: DATABASE_PAGES_URL
   Value: postgresql://postgres.myrnmfbrwndnrolfkdzt:Bob8Fast20qq@aws-1-eu-north-1.pooler.supabase.com:6543/postgres
   Environment: Production, Preview, Development (select all)
   ```

### Step 2: Verify Supabase Connection
1. Check that your Supabase database is accessible from external connections
2. Verify the connection string is correct
3. Ensure the database has the required `pages` table with proper schema

### Step 3: Test Database Schema
Run this SQL in your Supabase SQL editor to ensure proper table structure:
```sql
-- Verify pages table exists with all required columns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'pages'
ORDER BY ordinal_position;

-- Check if display control fields exist
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'pages'
AND column_name IN ('show_title', 'show_metadata', 'show_description');
```

### Step 4: Deploy and Monitor
1. Push your changes to your Git repository
2. Vercel will automatically deploy
3. Monitor the deployment logs for any errors
4. Check the Function Logs in Vercel dashboard

### Step 5: Test API Endpoints
After deployment, test these endpoints:
```bash
# Test page fetching
curl https://your-domain.vercel.app/api/dynamic-pages?slug=test-page

# Test all pages
curl https://your-domain.vercel.app/api/dynamic-pages?status=published

# Test specific page by ID
curl https://your-domain.vercel.app/api/dynamic-pages?id=your-page-id
```

## 🐛 Troubleshooting Common Issues

### Issue 1: "Module not found: pg"
**Solution**: The `pg` package is installed as a regular dependency (not devDependency)

### Issue 2: "Runtime not supported"
**Solution**: Ensure `export const runtime = 'nodejs'` is in all API route files

### Issue 3: "Connection timeout"
**Solution**: Database timeouts are increased for serverless cold starts

### Issue 4: "SSL connection error"
**Solution**: SSL is automatically enabled for Vercel environment

### Issue 5: Environment variable not found
**Solution**:
1. Check Vercel dashboard environment variables
2. Ensure variable is set for all environments (Production, Preview, Development)
3. Redeploy after adding environment variables

## 📊 Monitoring Database Performance

### Enable Detailed Logging
The database functions now include detailed logging:
- Connection attempts
- Query execution
- Error details with stack traces
- Performance metrics

### Check Vercel Function Logs
1. Go to Vercel dashboard
2. Navigate to **Functions** tab
3. Click on any API function to see detailed logs
4. Look for `[DB]` prefixed messages

## 🔧 Additional Optimizations

### Connection Pooling Best Practices
- Single connection per serverless function
- Automatic connection cleanup
- Optimized timeout settings

### Error Handling Strategy
- Graceful degradation for database errors
- Detailed logging for debugging
- Fallback mechanisms where appropriate

## 📝 Post-Deployment Verification

### Test Dynamic Pages
1. Visit your dynamic pages: `https://your-domain.vercel.app/[slug]`
2. Check legal pages: `https://your-domain.vercel.app/privacy-policy`
3. Verify API responses: `https://your-domain.vercel.app/api/dynamic-pages`

### Verify Display Controls
Test pages with display control fields to ensure they work correctly in production.

### Monitor Performance
- Check function execution times in Vercel dashboard
- Monitor database connection metrics in Supabase
- Watch for any timeout or memory issues

---

## 🆘 Need Help?

If you continue to experience issues after following this guide:

1. Check Vercel Function Logs for specific error messages
2. Verify environment variables are correctly set
3. Test database connectivity from Supabase directly
4. Ensure your Supabase plan supports external connections
5. Check if there are any IP restrictions on your database

Your database integration should now work seamlessly with Vercel's serverless environment!