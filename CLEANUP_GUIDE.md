# CareerGate - Temporary Hosting & Cleanup Guide

This guide helps you host the project for a demo/hackathon and then completely remove everything to avoid charges.

---

## Free Tier Limits & Timeline

### **Maximum Free Usage Period**

| Service | Free Tier Limit | Auto-Charges After | Safe Usage Period |
|---------|----------------|-------------------|-------------------|
| **Vercel** (Frontend) | Unlimited | Never (Free forever) | ∞ Forever |
| **Render** (Backend) | 750 hours/month | Never (just sleeps) | 1 month |
| **Neon** (Database) | 0.5GB storage | Never (just pauses) | ∞ Forever |
| **Cloudflare R2** (Storage) | 10GB storage | Never (free tier) | ∞ Forever |
| **OpenAI API** | Pay-as-you-go | Immediately | Depends on usage |

### **Recommended Timeline for Demo:**
- ✅ **Safe for 30 days** without any charges (except OpenAI usage)
- ⚠️ **OpenAI costs**: ~$5-10 for moderate demo usage (100-200 API calls)
- 🎯 **Best practice**: Deploy 1-2 days before demo, delete after

---

## Step-by-Step Deployment for Temporary Use

### **1. Deploy Everything (Day 1)**
Follow the main deployment guide to set up:
- ✅ Neon Database
- ✅ Render Backend
- ✅ Vercel Frontend
- ✅ Cloudflare R2 Storage

### **2. Use for Demo (Days 2-7)**
- Your app is live and accessible
- Render backend sleeps after 15 min of inactivity (free tier)
- First request after sleep takes ~30 seconds to wake up

### **3. Complete Cleanup (Day 8+)**
Follow the cleanup guide below

---

## Complete Cleanup Guide (Step-by-Step)

### **Step 1: Delete Render Backend**

1. **Login to Render**
   - Go to [dashboard.render.com](https://dashboard.render.com)
   - Login with your account

2. **Navigate to Your Service**
   - Click on `careergate-api` service

3. **Delete the Service**
   - Scroll to bottom of Settings page
   - Click **"Delete Web Service"**
   - Type the service name to confirm: `careergate-api`
   - Click **"Delete"**

**✅ Result**: Backend deleted, no more charges possible

---

### **Step 2: Delete Vercel Frontend**

1. **Login to Vercel**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)

2. **Select Your Project**
   - Click on `careergate` project

3. **Delete the Project**
   - Go to **Settings** tab
   - Scroll to **"Delete Project"** section (bottom)
   - Click **"Delete"**
   - Type `careergate` to confirm
   - Click **"Delete"**

**✅ Result**: Frontend deleted, domain released

---

### **Step 3: Delete Neon Database**

1. **Login to Neon**
   - Go to [console.neon.tech](https://console.neon.tech)

2. **Select Your Project**
   - Click on `careergate-db` project

3. **Delete the Project**
   - Click **Settings** (gear icon)
   - Scroll to **"Delete Project"**
   - Click **"Delete project"**
   - Type the project name to confirm
   - Click **"Delete"**

**✅ Result**: All data permanently deleted

---

### **Step 4: Delete Cloudflare R2 Bucket**

1. **Login to Cloudflare**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com)

2. **Navigate to R2**
   - Click **R2** in the left sidebar

3. **Delete the Bucket**
   - Find `careergate-resumes` bucket
   - Click **"..."** (three dots)
   - Click **"Delete"**
   - Confirm deletion

4. **Delete API Token (Optional but Recommended)**
   - Go to **R2** → **Manage R2 API Tokens**
   - Find your token
   - Click **"Delete"**

**✅ Result**: All uploaded resumes deleted

---

### **Step 5: Revoke OpenAI/OpenRouter API Key**

#### **If using OpenAI:**
1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Find your key (starts with `sk-proj-...`)
3. Click **"Revoke"**
4. Confirm

#### **If using OpenRouter:**
1. Go to [openrouter.ai/keys](https://openrouter.ai/keys)
2. Find your key (starts with `sk-or-v1-...`)
3. Click **"Delete"** or **"Revoke"**

**✅ Result**: No more API usage possible

---

### **Step 6: Delete GitHub Repository (Optional)**

⚠️ **Only do this if you don't want to keep the code**

1. **Go to GitHub**
   - Navigate to `https://github.com/saisirram/careergate`

2. **Delete Repository**
   - Click **Settings** tab
   - Scroll to **"Danger Zone"** (bottom)
   - Click **"Delete this repository"**
   - Type `saisirram/careergate` to confirm
   - Click **"I understand the consequences, delete this repository"**

**✅ Result**: Code removed from GitHub

---

## Quick Cleanup Checklist

Use this checklist to ensure complete cleanup:

```
☐ Render Backend deleted
☐ Vercel Frontend deleted
☐ Neon Database deleted
☐ Cloudflare R2 bucket deleted
☐ Cloudflare R2 API token revoked
☐ OpenAI/OpenRouter API key revoked
☐ GitHub repository deleted (optional)
☐ Local .env files deleted (optional)
```

---

## Cost Monitoring (Before Cleanup)

### **Check Your Costs Before Deleting**

#### **OpenAI Usage:**
1. Go to [platform.openai.com/usage](https://platform.openai.com/usage)
2. Check total usage for current month
3. Typical demo costs: $2-5 for 50-100 roadmap generations

#### **OpenRouter Usage:**
1. Go to [openrouter.ai/activity](https://openrouter.ai/activity)
2. Check credits used
3. Free models = $0 cost

#### **Render:**
- Free tier = $0 (just check you didn't accidentally select paid tier)

#### **Vercel:**
- Free tier = $0 forever

#### **Neon:**
- Free tier = $0 (0.5GB limit)

#### **Cloudflare R2:**
- Free tier = $0 (10GB limit)

---

## Emergency: Immediate Shutdown

If you need to stop everything **RIGHT NOW** (e.g., unexpected charges):

### **1. Suspend Render Backend (30 seconds)**
```
Render Dashboard → careergate-api → Settings → Suspend Service
```

### **2. Set OpenAI Usage Limit (1 minute)**
```
OpenAI Dashboard → Settings → Billing → Set monthly limit to $0
```

### **3. Delete Vercel Deployment (1 minute)**
```
Vercel Dashboard → careergate → Settings → Delete
```

**Total Time**: ~3 minutes to stop all services

---

## Redeployment (If Needed Later)

If you deleted everything but want to redeploy:

1. **Code is still local** on your machine
2. **Push to GitHub** again (if deleted)
3. **Follow deployment guide** from Step 1
4. **Estimated time**: 30-45 minutes to redeploy everything

---

## Pro Tips for Demo Day

### **Before Demo:**
- ✅ Deploy 1-2 days before
- ✅ Test all features thoroughly
- ✅ Keep Render backend "warm" by visiting it every 10 minutes
- ✅ Set OpenAI usage limit to $10 (safety net)

### **During Demo:**
- ✅ Have local backup running (in case of deployment issues)
- ✅ Monitor OpenAI usage dashboard
- ✅ Use a custom domain (optional, looks more professional)

### **After Demo:**
- ✅ Wait 1-2 days (in case judges want to re-check)
- ✅ Download any important data from Neon
- ✅ Follow cleanup guide above
- ✅ Verify all services deleted

---

## FAQ

**Q: Will I get charged if I forget to delete?**
A: No automatic charges on free tiers. Only OpenAI is pay-as-you-go.

**Q: How long can I keep it running for free?**
A: Indefinitely on Vercel, Neon, and Cloudflare. Render free tier = 750 hours/month (enough for 1 month).

**Q: What if I exceed free tier limits?**
A: Services will pause/stop, not charge you (except OpenAI).

**Q: Can I pause instead of delete?**
A: Yes! Render has a "Suspend" option. Vercel/Neon auto-pause when inactive.

**Q: How to avoid OpenAI charges?**
A: Use OpenRouter free models (already configured in your app).

---

**Last Updated**: February 11, 2026
**Estimated Cleanup Time**: 10-15 minutes
**Estimated Demo Cost**: $0-10 (OpenAI usage only)
