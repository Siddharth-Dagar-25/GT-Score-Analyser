# Deploy to Vercel (Recommended - Frontend Only)

Since your app uses localStorage (no backend needed), you only need to deploy the frontend to Vercel.

## Option 1: Deploy via Vercel CLI (Fastest)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Navigate to Frontend Directory
```bash
cd frontend
```

### Step 4: Deploy
```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? (Choose your account)
- Link to existing project? **No**
- Project name? (Press Enter for default or type a name)
- Directory? **./** (current directory)
- Override settings? **No**

### Step 5: Your App is Live!
Vercel will give you a URL like: `https://your-app-name.vercel.app`

---

## Option 2: Deploy via Vercel Dashboard (Easier)

### Step 1: Push to GitHub
```bash
# If not already a git repo
git init
git add .
git commit -m "Initial commit"

# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/GT-Score-Analyser.git
git push -u origin main
```

### Step 2: Import to Vercel
1. Go to https://vercel.com
2. Sign up/Login with GitHub
3. Click **"Add New Project"**
4. Import your GitHub repository
5. Configure:
   - **Framework Preset:** Create React App
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
6. Click **"Deploy"**

### Step 3: Your App is Live!
Vercel will automatically deploy and give you a URL.

---

## Custom Domain (Optional)

1. Go to your project on Vercel dashboard
2. Click **Settings** → **Domains**
3. Add your custom domain
4. Follow DNS configuration instructions

---

## Environment Variables (If Needed)

If you add any environment variables later:
1. Go to Project Settings → Environment Variables
2. Add your variables
3. Redeploy

---

## Automatic Deployments

Vercel automatically deploys when you push to:
- `main` branch → Production
- Other branches → Preview deployments

---

## Build Settings for Reference

- **Framework:** Create React App
- **Build Command:** `npm run build`
- **Output Directory:** `build`
- **Install Command:** `npm install`

