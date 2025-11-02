# Weather PWA

A modern, lightweight Progressive Web App for checking weather forecasts. Built with vanilla JavaScript, Tailwind CSS, and pure SVG icons.

## Overview

This PWA provides real-time weather information and 3-day forecasts for any location worldwide. It features offline functionality, geolocation support, and a beautiful responsive interface.

## Tech Stack

- **Frontend:** HTML5, Tailwind CSS (CDN), Vanilla JavaScript (ES6+)
- **Icons:** Pure inline SVG (no external dependencies)
- **API:** OpenWeatherMap (Current Weather & Forecast)
- **PWA:** Service Worker for offline support
- **Storage:** LocalStorage for caching (30-min TTL)

## Features

- 🔍 **City Search** - Search weather for any city worldwide
- 📍 **Geolocation** - Auto-detect your current location
- 🌡️ **Current Weather** - Temperature, humidity, wind speed, feels-like
- 📅 **3-Day Forecast** - Extended weather predictions
- 🔌 **Offline Support** - Works without internet (cached data)
- 📱 **Installable** - Add to home screen (PWA)
- 🎨 **Responsive** - Mobile-first design, works on all devices
- ⚡ **Fast** - Optimized code, instant loading

## Quick Start

1. **Get API Key** (Free)
   - Visit [OpenWeatherMap API](https://openweathermap.org/api)
   - Sign up and get your free API key
   - Add to `app.js` line 3: `API_KEY: 'your_key_here'`

2. **Start Server**
   ```bash
   ./start.sh
   ```

3. **Open Browser**
   - Navigate to `http://localhost:8001`
   - Start searching for weather!

## Project Structure

```
pwa/
├── index.html          # Main application (Tailwind + SVG)
├── styles.css          # Minimal base styles (16 lines)
├── app.js              # Application logic (257 lines)
├── service-worker.js   # PWA offline support (98 lines)
├── manifest.json       # PWA configuration
├── start.sh            # Server startup script
└── README.md           # This file
```

## Code Stats

- **Total Lines:** ~430 lines
- **HTML:** 159 lines
- **CSS:** 16 lines (minimal)
- **JavaScript:** 257 lines (app.js + service-worker.js)
- **Zero Dependencies** (except Tailwind CDN)

## Browser Support

- Chrome 67+
- Firefox 63+
- Safari 11.1+
- Edge 79+

## Deployment

Deploy to any static hosting:
- **Netlify:** Drag and drop folder
- **Vercel:** `vercel deploy`
- **GitHub Pages:** Push to gh-pages branch
- **Any web server:** Just upload files

## Development

```bash
# Start development server
./start.sh

# Server runs on port 8001
# Hot reload: Refresh browser after changes
```

## Architecture

### Service Worker Strategies
- **Static Assets:** Cache First (instant loading)
- **API Calls:** Network First (fresh data preferred)
- **Offline:** Cached data fallback

### Caching
- **Browser Cache:** Service Worker (static assets)
- **LocalStorage:** Weather data (30-min expiry)
- **Offline:** Shows last cached location

## API Usage

**OpenWeatherMap Free Tier:**
- 60 calls/minute
- 1,000,000 calls/month
- Perfect for personal use

**API Calls:**
- Search: 2 calls per city (current + forecast)
- Geolocation: 2 calls per location
- With cache: ~4-10 calls/day typical use

## License

Free for personal and educational use.

---

**Built with vanilla web technologies - No frameworks, no build tools, just clean code.**
