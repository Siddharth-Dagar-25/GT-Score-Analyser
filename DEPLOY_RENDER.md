# Deploy to Render (Alternative Option)

## Option A: Deploy Frontend Only (Recommended)

Since you're using localStorage, you only need the frontend.

### Step 1: Prepare for Deployment

Create a `render.yaml` in the root directory:

```yaml
services:
  - type: web
    name: score-analyser
    env: static
    buildCommand: cd frontend && npm install && npm run build
    staticPublishPath: frontend/build
```

### Step 2: Deploy on Render

1. Go to https://render.com
2. Sign up/Login (GitHub recommended)
3. Click **"New +"** → **"Static Site"**
4. Connect your GitHub repository
5. Configure:
   - **Name:** score-analyser (or any name)
   - **Branch:** main
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `build`
6. Click **"Create Static Site"**

### Step 3: Your App is Live!
Render will give you a URL like: `https://score-analyser.onrender.com`

---

## Option B: Deploy Full Stack (If You Want Backend Later)

### Step 1: Deploy Backend

1. Go to Render Dashboard
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name:** score-analyser-backend
   - **Root Directory:** `backend`
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Environment Variables:**
     - `PORT=10000` (Render provides this)
     - `MONGODB_URI=your_mongodb_connection_string` (if using MongoDB)
5. Click **"Create Web Service"**

### Step 2: Deploy Frontend

1. Click **"New +"** → **"Static Site"**
2. Configure:
   - **Name:** score-analyser-frontend
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `build`
   - **Environment Variables:**
     - `REACT_APP_API_URL=https://your-backend-url.onrender.com`
3. Click **"Create Static Site"**

### Step 3: Update Frontend API URL

In `frontend/src/services/api.js`, update the base URL to your Render backend URL.

---

## Free Tier Limitations

- **Static Sites:** Free forever
- **Web Services:** Free tier available but:
  - Spins down after 15 minutes of inactivity
  - Takes ~30 seconds to wake up
  - 750 hours/month free

---

## Custom Domain

1. Go to your service settings
2. Click **"Custom Domains"**
3. Add your domain
4. Update DNS records as instructed

