# MongoDB Setup Guide

This guide will help you set up MongoDB for the Score Analyser application.

## Quick Setup Options

### Option 1: MongoDB Atlas (Cloud - Easiest & Free)

**Step 1: Create Account**
1. Visit https://www.mongodb.com/cloud/atlas/register
2. Sign up with your email (free tier available)

**Step 2: Create Cluster**
1. After login, click "Build a Database"
2. Select "FREE" (M0) tier
3. Choose a cloud provider (AWS recommended)
4. Select a region closest to you
5. Click "Create Cluster" (takes 3-5 minutes)

**Step 3: Create Database User**
1. In the left sidebar, click "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication method
4. Enter:
   - Username: `scoreanalyser` (or your choice)
   - Password: Create a strong password (SAVE THIS!)
5. Under "Database User Privileges", select "Atlas admin"
6. Click "Add User"

**Step 4: Whitelist IP Address**
1. In the left sidebar, click "Network Access"
2. Click "Add IP Address"
3. For development/testing: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - ⚠️ For production, use specific IPs only
4. Click "Confirm"

**Step 5: Get Connection String**
1. In the left sidebar, click "Database"
2. Click "Connect" button on your cluster
3. Select "Connect your application"
4. Choose "Node.js" and version "4.1 or later"
5. Copy the connection string

**Step 6: Configure Your App**
1. Open `backend/.env` file
2. Replace the connection string:
   ```
   MONGODB_URI=mongodb+srv://scoreanalyser:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/score-analyser?retryWrites=true&w=majority
   ```
3. Replace `YOUR_PASSWORD` with the password you created in Step 3
4. Replace `cluster0.xxxxx` with your actual cluster name
5. The `score-analyser` part is your database name (you can change it)

**Example:**
```
MONGODB_URI=mongodb+srv://scoreanalyser:MySecurePass123@cluster0.abc123.mongodb.net/score-analyser?retryWrites=true&w=majority
```

---

### Option 2: Local MongoDB Installation

**For macOS:**
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**For Windows:**
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Run the installer
3. Choose "Complete" installation
4. Install as a Windows Service
5. MongoDB Compass (GUI) is optional but helpful

**For Linux (Ubuntu/Debian):**
```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create list file
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update and install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

**Configure for Local MongoDB:**
1. Open `backend/.env` file
2. Set connection string:
   ```
   MONGODB_URI=mongodb://localhost:27017/score-analyser
   ```

---

## Verify Connection

After setting up, test your connection:

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. You should see:
   ```
   MongoDB Connected Successfully
   Server running on port 5000
   ```

3. If you see connection errors:
   - Double-check your connection string
   - Verify MongoDB is running (for local)
   - Check IP whitelist (for Atlas)
   - Verify username/password are correct

---

## Common Issues & Solutions

### Issue: "MongoServerError: Authentication failed"
**Solution:** 
- Check your username and password in the connection string
- Ensure special characters in password are URL-encoded (e.g., `@` becomes `%40`)

### Issue: "MongoNetworkError: connect ECONNREFUSED"
**Solution:**
- For local: Ensure MongoDB service is running
- For Atlas: Check IP whitelist includes your IP address

### Issue: "MongoParseError: Invalid connection string"
**Solution:**
- Ensure connection string starts with `mongodb://` or `mongodb+srv://`
- Check for typos in the connection string
- Verify no extra spaces or quotes

### Issue: Connection works but data not saving
**Solution:**
- Check database name in connection string
- Verify user has read/write permissions
- Check MongoDB logs for errors

---

## Security Best Practices

1. **Never commit `.env` file to Git** (already in .gitignore)
2. **Use strong passwords** for database users
3. **Limit IP access** in production (don't use 0.0.0.0/0)
4. **Use environment variables** for all sensitive data
5. **Regular backups** of your database

---

## Need Help?

- MongoDB Atlas Documentation: https://docs.atlas.mongodb.com/
- MongoDB Community Forum: https://developer.mongodb.com/community/forums/
- Local MongoDB Docs: https://docs.mongodb.com/manual/installation/

---

## Quick Reference

**Atlas Connection String Format:**
```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

**Local Connection String Format:**
```
mongodb://localhost:27017/<database>
```

**Your `.env` file should contain:**
```env
PORT=5000
MONGODB_URI=your_connection_string_here
NODE_ENV=development
```

