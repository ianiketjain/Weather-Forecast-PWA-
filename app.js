// Config
const CONFIG = {
    API_KEY: '5796abbde9106b7da4febfae8c44c232',
    API_URL: 'https://api.openweathermap.org/data/2.5',
    CACHE_KEY: 'weather-cache',
    CACHE_TTL: 1800000 // 30 minutes
};

// DOM Elements
const $ = (id) => document.getElementById(id);
const elements = {
    form: $('search-form'),
    input: $('city-input'),
    locateBtn: $('locate-btn'),
    loading: $('loading'),
    error: $('error'),
    errorMsg: $('error-msg'),
    retryBtn: $('retry-btn'),
    weather: $('weather'),
    offline: $('offline'),
    status: $('status'),
    statusText: $('status-text'),
    location: $('location'),
    country: $('country'),
    icon: $('icon'),
    temp: $('temp'),
    desc: $('desc'),
    feels: $('feels'),
    humidity: $('humidity'),
    wind: $('wind'),
    updated: $('updated'),
    forecast: $('forecast')
};

// State
let currentCity = '';

// Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(() => console.log('SW registered'))
        .catch((e) => console.error('SW failed:', e));
}

// Online/Offline Status
const updateStatus = () => {
    const online = navigator.onLine;
    elements.statusText.textContent = online ? 'Online' : 'Offline';
    elements.status.className = online 
        ? 'flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg text-white text-sm'
        : 'flex items-center gap-2 bg-red-500/80 px-4 py-2 rounded-lg text-white text-sm';
};
window.addEventListener('online', updateStatus);
window.addEventListener('offline', updateStatus);

// Weather Icons (SVG)
const getWeatherIcon = (code) => {
    const icons = {
        '01d': '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2"><circle cx="32" cy="32" r="12" fill="#fbbf24"/><g stroke="#fbbf24" stroke-width="3"><line x1="32" y1="6" x2="32" y2="12"/><line x1="32" y1="52" x2="32" y2="58"/><line x1="6" y1="32" x2="12" y2="32"/><line x1="52" y1="32" x2="58" y2="32"/><line x1="13" y1="13" x2="17" y2="17"/><line x1="47" y1="47" x2="51" y2="51"/><line x1="13" y1="51" x2="17" y2="47"/><line x1="47" y1="17" x2="51" y2="13"/></g></svg>',
        '01n': '<svg viewBox="0 0 64 64" fill="none"><path d="M40 12a20 20 0 1 1-32 16 16 16 0 1 1 24-22z" fill="#60a5fa" stroke="#3b82f6" stroke-width="2"/></svg>',
        '02d': '<svg viewBox="0 0 64 64" fill="none"><circle cx="22" cy="22" r="8" fill="#fbbf24"/><path d="M42 38c0-6-4-10-10-10s-10 4-10 10v2h20z" fill="#fff" stroke="#9ca3af" stroke-width="2"/></svg>',
        '02n': '<svg viewBox="0 0 64 64" fill="none"><path d="M30 12a12 12 0 1 1-18 10 10 10 0 1 1 15-14z" fill="#60a5fa"/><path d="M42 38c0-6-4-10-10-10s-10 4-10 10v2h20z" fill="#fff" stroke="#9ca3af" stroke-width="2"/></svg>',
        '03d': '<svg viewBox="0 0 64 64" fill="none"><ellipse cx="32" cy="36" rx="18" ry="12" fill="#fff" stroke="#9ca3af" stroke-width="2"/></svg>',
        '04d': '<svg viewBox="0 0 64 64" fill="none"><ellipse cx="26" cy="32" rx="16" ry="10" fill="#9ca3af"/><ellipse cx="38" cy="36" rx="16" ry="10" fill="#6b7280"/></svg>',
        '09d': '<svg viewBox="0 0 64 64" fill="none"><ellipse cx="32" cy="26" rx="18" ry="10" fill="#6b7280"/><line x1="24" y1="38" x2="22" y2="46" stroke="#3b82f6" stroke-width="2"/><line x1="32" y1="38" x2="30" y2="46" stroke="#3b82f6" stroke-width="2"/><line x1="40" y1="38" x2="38" y2="46" stroke="#3b82f6" stroke-width="2"/></svg>',
        '10d': '<svg viewBox="0 0 64 64" fill="none"><circle cx="22" cy="18" r="6" fill="#fbbf24"/><ellipse cx="32" cy="30" rx="16" ry="10" fill="#9ca3af"/><line x1="26" y1="42" x2="24" y2="48" stroke="#3b82f6" stroke-width="2"/><line x1="32" y1="42" x2="30" y2="48" stroke="#3b82f6" stroke-width="2"/><line x1="38" y1="42" x2="36" y2="48" stroke="#3b82f6" stroke-width="2"/></svg>',
        '11d': '<svg viewBox="0 0 64 64" fill="none"><ellipse cx="32" cy="24" rx="18" ry="10" fill="#374151"/><path d="M32 36 28 42h4l-2 8 6-10h-4z" fill="#fbbf24" stroke="#f59e0b" stroke-width="1"/></svg>',
        '13d': '<svg viewBox="0 0 64 64" fill="none"><ellipse cx="32" cy="26" rx="18" ry="10" fill="#e5e7eb"/><circle cx="24" cy="40" r="3" fill="#fff" stroke="#cbd5e1"/><circle cx="32" cy="42" r="3" fill="#fff" stroke="#cbd5e1"/><circle cx="40" cy="40" r="3" fill="#fff" stroke="#cbd5e1"/></svg>',
        '50d': '<svg viewBox="0 0 64 64" fill="none" stroke="#9ca3af" stroke-width="3"><line x1="12" y1="24" x2="52" y2="24"/><line x1="12" y1="32" x2="52" y2="32"/><line x1="12" y1="40" x2="52" y2="40"/></svg>'
    };
    return icons[code] || icons['01d'];
};

// UI Functions
const show = (el) => el.classList.remove('hidden');
const hide = (el) => el.classList.add('hidden');

const showLoading = () => {
    hide(elements.error);
    hide(elements.weather);
    hide(elements.offline);
    show(elements.loading);
};

const showError = (msg) => {
    elements.errorMsg.textContent = msg;
    hide(elements.loading);
    hide(elements.weather);
    hide(elements.offline);
    show(elements.error);
};

const showWeather = () => {
    hide(elements.loading);
    hide(elements.error);
    hide(elements.offline);
    show(elements.weather);
};

const showOffline = () => {
    hide(elements.loading);
    hide(elements.error);
    hide(elements.weather);
    show(elements.offline);
};

// Cache Functions
const getCache = (city) => {
    const cache = localStorage.getItem(CONFIG.CACHE_KEY);
    if (!cache) return null;
    const data = JSON.parse(cache)[city.toLowerCase()];
    if (!data || Date.now() - data.time > CONFIG.CACHE_TTL) return null;
    return data.weather;
};

const setCache = (city, weather) => {
    const cache = JSON.parse(localStorage.getItem(CONFIG.CACHE_KEY) || '{}');
    cache[city.toLowerCase()] = { time: Date.now(), weather };
    localStorage.setItem(CONFIG.CACHE_KEY, JSON.stringify(cache));
};

// API Functions
const fetchWeather = async (city) => {
    const res = await fetch(`${CONFIG.API_URL}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${CONFIG.API_KEY}`);
    if (!res.ok) throw new Error(res.status === 404 ? 'City not found' : 'Failed to fetch weather');
    return res.json();
};

const fetchForecast = async (lat, lon) => {
    const res = await fetch(`${CONFIG.API_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${CONFIG.API_KEY}`);
    if (!res.ok) throw new Error('Failed to fetch forecast');
    return res.json();
};

const fetchByCoords = async (lat, lon) => {
    const res = await fetch(`${CONFIG.API_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${CONFIG.API_KEY}`);
    if (!res.ok) throw new Error('Failed to fetch weather');
    return res.json();
};

// Display Functions
const formatDate = (ts) => new Date(ts * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
const formatTime = () => new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

const displayWeather = (current, forecast) => {
    elements.location.textContent = current.name;
    elements.country.textContent = current.sys.country;
    elements.icon.innerHTML = getWeatherIcon(current.weather[0].icon);
    elements.temp.textContent = Math.round(current.main.temp);
    elements.desc.textContent = current.weather[0].description;
    elements.feels.textContent = `${Math.round(current.main.feels_like)}°C`;
    elements.humidity.textContent = `${current.main.humidity}%`;
    elements.wind.textContent = `${current.wind.speed} m/s`;
    elements.updated.textContent = `Updated: ${formatTime()}`;

    // Forecast
    const daily = [];
    const seen = new Set();
    for (const item of forecast.list) {
        const date = new Date(item.dt * 1000).toDateString();
        if (!seen.has(date) && daily.length < 3) {
            seen.add(date);
            daily.push(item);
        }
    }

    elements.forecast.innerHTML = daily.map(f => `
        <div class="bg-gray-50 rounded-xl p-6 text-center hover:bg-gray-100 transition">
            <p class="font-semibold text-gray-700 mb-2">${formatDate(f.dt)}</p>
            <div class="w-16 h-16 mx-auto mb-2">${getWeatherIcon(f.weather[0].icon)}</div>
            <p class="text-2xl font-bold text-gray-900 mb-2">${Math.round(f.main.temp)}°C</p>
            <p class="text-sm text-gray-600 capitalize">${f.weather[0].description}</p>
        </div>
    `).join('');

    showWeather();
};

// Load Weather
const loadWeather = async (city) => {
    currentCity = city;
    showLoading();

    if (CONFIG.API_KEY === 'YOUR_API_KEY') {
        showError('API key required.');
        return;
    }

    if (navigator.onLine) {
        try {
            const current = await fetchWeather(city);
            const forecast = await fetchForecast(current.coord.lat, current.coord.lon);
            const data = { current, forecast };
            setCache(city, data);
            displayWeather(current, forecast);
        } catch (e) {
            const cached = getCache(city);
            if (cached) {
                displayWeather(cached.current, cached.forecast);
                elements.updated.textContent += ' (cached)';
            } else {
                showError(e.message);
            }
        }
    } else {
        const cached = getCache(city);
        cached ? (displayWeather(cached.current, cached.forecast), elements.updated.textContent += ' (offline)') : showOffline();
    }
};

// Geolocation
const handleLocation = () => {
    if (!navigator.geolocation) {
        showError('Geolocation not supported');
        return;
    }
    showLoading();
    navigator.geolocation.getCurrentPosition(
        async (pos) => {
            try {
                const current = await fetchByCoords(pos.coords.latitude, pos.coords.longitude);
                const forecast = await fetchForecast(current.coord.lat, current.coord.lon);
                currentCity = current.name;
                const data = { current, forecast };
                setCache(currentCity, data);
                displayWeather(current, forecast);
            } catch (e) {
                showError(e.message);
            }
        },
        () => showError('Unable to get location')
    );
};

// Event Listeners
elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = elements.input.value.trim();
    if (city) loadWeather(city);
});

elements.locateBtn.addEventListener('click', handleLocation);
elements.retryBtn.addEventListener('click', () => currentCity && loadWeather(currentCity));

// Init
updateStatus();
const cache = localStorage.getItem(CONFIG.CACHE_KEY);
if (cache) {
    const cities = Object.keys(JSON.parse(cache));
    if (cities.length) {
        const recent = cities.reduce((a, b) => 
            JSON.parse(cache)[a].time > JSON.parse(cache)[b].time ? a : b
        );
        loadWeather(recent);
    }
}
