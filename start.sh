#!/bin/bash

#############################################
# Weather PWA - Server Start Script
#############################################

clear
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "    🌤️  Weather PWA - Starting Server    "
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if API key is configured (check the actual API_KEY value, not comments)
if grep -E "^\s*API_KEY:\s*['\"]YOUR_API_KEY['\"]" app.js >/dev/null 2>&1; then
    echo "⚠️  WARNING: API Key not configured!"
    echo ""
    echo "Please follow these steps:"
    echo "1. Get FREE API key: https://openweathermap.org/api"
    echo "2. Open app.js in a text editor"
    echo "3. Replace 'YOUR_API_KEY' on line 19 with your key"
    echo "4. Run this script again"
    echo ""
    exit 1
fi

# Detect and start available server
PORT=8001

# Check for Python 3
if command -v python3 &> /dev/null; then
    echo "✅ Starting server with Python 3..."
    echo "📱 Open your browser to: http://localhost:$PORT"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    python3 -m http.server $PORT
    exit 0
fi

# Check for Python 2
if command -v python &> /dev/null; then
    echo "✅ Starting server with Python 2..."
    echo "📱 Open your browser to: http://localhost:$PORT"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    python -m SimpleHTTPServer $PORT
    exit 0
fi

# Check for Node.js
if command -v node &> /dev/null; then
    if command -v npx &> /dev/null; then
        echo "✅ Starting server with Node.js..."
        echo "📱 Open your browser to: http://localhost:$PORT"
        echo ""
        echo "Press Ctrl+C to stop the server"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        npx http-server -p $PORT
        exit 0
    fi
fi

# Check for PHP
if command -v php &> /dev/null; then
    echo "✅ Starting server with PHP..."
    echo "📱 Open your browser to: http://localhost:$PORT"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    php -S localhost:$PORT
    exit 0
fi

# No suitable server found
echo "❌ No suitable server found!"
echo ""
echo "Please install one of the following:"
echo "  • Python: https://www.python.org/downloads/"
echo "  • Node.js: https://nodejs.org/"
echo "  • PHP: https://www.php.net/downloads"
echo ""
echo "Or use VS Code Live Server extension"
echo ""
exit 1

