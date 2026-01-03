# Testing on Your Phone (Without Deploying)

## Quick Method: Test on Same WiFi Network

### Step 1: Find Your Computer's IP Address

**On Mac:**
```bash
# Open Terminal and run:
ifconfig | grep "inet " | grep -v 127.0.0.1
```
Look for something like `192.168.1.xxx` or `10.0.0.xxx`

**On Windows:**
```bash
# Open Command Prompt and run:
ipconfig
```
Look for "IPv4 Address" under your WiFi adapter

**On Linux:**
```bash
hostname -I
```

### Step 2: Start the Development Server

```bash
cd frontend
npm start
```

### Step 3: Allow External Connections

By default, React dev server only accepts localhost. You need to start it with your IP:

```bash
# Stop the current server (Ctrl+C), then run:
HOST=0.0.0.0 npm start
```

Or on Windows:
```bash
set HOST=0.0.0.0 && npm start
```

### Step 4: Access from Your Phone

1. Make sure your phone is on the **same WiFi network** as your computer
2. Open your phone's browser
3. Go to: `http://YOUR_IP_ADDRESS:3000`
   - Example: `http://192.168.1.100:3000`

### Alternative: Use ngrok (Works from Anywhere)

If you want to test from anywhere (not just same WiFi):

1. Install ngrok: https://ngrok.com/download
2. Start your React app: `cd frontend && npm start`
3. In another terminal, run: `ngrok http 3000`
4. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
5. Open that URL on your phone from anywhere!

---

## Troubleshooting

**Can't connect?**
- Make sure both devices are on the same WiFi
- Check your firewall isn't blocking port 3000
- Try disabling VPN if you're using one

**Connection refused?**
- Make sure you used `HOST=0.0.0.0` when starting the server
- Check that port 3000 isn't already in use

