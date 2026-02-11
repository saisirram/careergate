# Alternative: Using Supabase Storage Instead of Cloudflare R2

If you're having trouble with Cloudflare R2, Supabase Storage is a simpler alternative with the same S3-compatible API.

## Why Supabase Storage?
- ✅ Easier UI and setup
- ✅ 1GB free storage (enough for demo)
- ✅ S3-compatible (works with your existing MinIO code)
- ✅ No credit card required
- ✅ Built-in file browser

## Setup Steps (5 minutes)

### Step 1: Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (recommended)

### Step 2: Create a New Project
1. Click "New Project"
2. **Name**: `careergate`
3. **Database Password**: (generate a strong one, save it)
4. **Region**: Choose closest to you
5. Click "Create new project" (takes ~2 minutes)

### Step 3: Create Storage Bucket
1. In left sidebar, click **"Storage"**
2. Click **"Create a new bucket"**
3. **Name**: `resumes`
4. **Public bucket**: Toggle OFF (keep private)
5. Click **"Create bucket"**

### Step 4: Get Your Credentials

1. Go to **Settings** (gear icon, bottom left)
2. Click **"API"** in the settings menu
3. You'll see:
   - **Project URL**: `https://abcdefghijklmnop.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (click "Reveal" to see)

4. Copy the **service_role key** (this is your secret key)

### Step 5: Update Your Application

#### Update `application.properties`:
```properties
# Supabase Storage Configuration
supabase.url=${SUPABASE_URL:https://your-project.supabase.co}
supabase.key=${SUPABASE_SERVICE_KEY:your-service-role-key}
supabase.bucket=${SUPABASE_BUCKET:resumes}
```

#### Update MinIO Configuration Class:
You'll need to modify your `MinioConfig.java` to use Supabase's REST API instead of S3 API.

**OR** use Supabase's S3-compatible endpoint (if available in your region).

### Step 6: Environment Variables

For Render deployment:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key-here
SUPABASE_BUCKET=resumes
```

## Pros and Cons

### Supabase:
- ✅ Easier setup
- ✅ Better UI for managing files
- ✅ 1GB free (enough for demo)
- ❌ Requires code changes to use REST API

### Cloudflare R2:
- ✅ 10GB free
- ✅ S3-compatible (no code changes)
- ❌ More complex token setup
- ❌ Less intuitive UI

## Recommendation

**For a quick demo/hackathon**: Use Supabase
**For production**: Use Cloudflare R2 (better pricing at scale)
