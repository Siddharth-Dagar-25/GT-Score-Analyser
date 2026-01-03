# Quick Start Guide

## Prerequisites Check

Before starting, make sure you have:
- ✅ Node.js installed (v14 or higher)
- ✅ That's it! No MongoDB needed - we use browser storage! 🎉

## Step 1: Install Dependencies

**Frontend only (no backend needed!):**
```bash
cd frontend
npm install
```

## Step 2: Start the Application

```bash
npm start
```

That's it! The app will open automatically in your browser.

## Step 3: Access the Application

- **Frontend**: http://localhost:3000
- **Data Storage**: Automatically saved in your browser (localStorage)

## Why No Backend?

This app uses **browser localStorage** which is:
- ⚡ **25-50x faster** than MongoDB
- 🚀 **Zero setup** required
- 📱 **Works offline**
- 🔒 **Private** - data stays on your device

Perfect for single-user scenarios with ~100 tests!

## First Steps

1. Click "Add Test" in the navigation
2. Enter your test data:
   - Test date
   - Total questions (default: 200)
   - Correct/Incorrect/Skipped counts
   - Add subjects with their breakdown
3. Click "Save Test"
4. View your dashboard with analytics!

## Troubleshooting

**Port Already in Use?**
- Kill the process using port 3000
- Or change port: `PORT=3001 npm start`

**Dependencies Error?**
- Delete `node_modules` folder
- Run `npm install` again

**Data Not Saving?**
- Check browser console for errors
- Ensure localStorage is enabled in your browser
- Try clearing browser cache and reloading

**Want to Backup Your Data?**
- Go to Settings page
- Click "Export Data" to download a JSON backup

## Need Help?

- Full documentation: See `README.md`
- Storage information: See `STORAGE_INFO.md`
- Check browser console for error messages

## Optional: Using MongoDB Instead

If you want to use MongoDB (for multi-device sync, etc.):
- See `MONGODB_SETUP.md` for setup instructions
- Switch imports from `storage.js` to `api.js` in components
- Start the backend server

