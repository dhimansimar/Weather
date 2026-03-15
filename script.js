const apiKey = "33a5b850f3df41cf9ae84149261503";

const elements = {
    cityInput: document.getElementById("cityInput"),
    getWeatherBtn: document.getElementById("getWeatherBtn"),
    toggleTempBtn: document.getElementById("toggleTempBtn"),
    weatherResult: document.getElementById("weatherResult"),
    error: document.getElementById("error"),
    cityName: document.getElementById("cityName"),
    localTime: document.getElementById("localTime"),
    temperature: document.getElementById("temperature"),
    condition: document.getElementById("condition"),
    wind: document.getElementById("wind"),
    humidity: document.getElementById("humidity"),
    sunriseSunset: document.getElementById("sunriseSunset"),
    icon: document.getElementById("icon"),
};

let isCelsius = true;
let currentTempC = 0;
let currentTempF = 0;

// Event listeners
elements.getWeatherBtn.addEventListener("click", searchWeather);
elements.cityInput.addEventListener("keypress", e => {
    if (e.key === "Enter") searchWeather();
});
elements.toggleTempBtn.addEventListener("click", toggleTemperature);

function searchWeather() {
    const city = elements.cityInput.value.trim();
    if (!city) return;

    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=1&aqi=no&alerts=no`)
        .then(res => {
            if (!res.ok) throw new Error("City not found");
            return res.json();
        })
        .then(data => displayWeather(data))
        .catch(err => showError(err.message));
}

function displayWeather(data) {
    elements.error.classList.add("hidden");
    elements.weatherResult.classList.remove("hidden");

    elements.cityName.textContent = `${data.location.name}, ${data.location.country}`;
    elements.localTime.textContent = `Local Time: ${data.location.localtime}`;
    currentTempC = data.current.temp_c;
    currentTempF = data.current.temp_f;
    updateTemperature();
    elements.condition.textContent = `Condition: ${data.current.condition.text}`;
    elements.wind.textContent = `Wind: ${data.current.wind_kph} kph ${data.current.wind_dir}`;
    elements.humidity.textContent = `Humidity: ${data.current.humidity}%`;
    elements.sunriseSunset.textContent = `Sunrise: ${data.forecast.forecastday[0].astro.sunrise} | Sunset: ${data.forecast.forecastday[0].astro.sunset}`;
    elements.icon.src = data.current.condition.icon;

    applyBackground(data.current.condition.text);
}

function showError(msg) {
    elements.weatherResult.classList.add("hidden");
    elements.error.textContent = msg;
    elements.error.classList.remove("hidden");
}

function applyBackground(condition) {
    let bg;
    if (/sunny|clear/i.test(condition)) bg = "linear-gradient(to right, #fceabb, #f8b500)";
    else if (/cloud/i.test(condition)) bg = "linear-gradient(to right, #bdc3c7, #2c3e50)";
    else if (/rain/i.test(condition)) bg = "linear-gradient(to right, #4e54c8, #8f94fb)";
    else if (/snow/i.test(condition)) bg = "linear-gradient(to right, #e0eafc, #cfdef3)";
    else bg = "linear-gradient(to right, #89f7fe, #66a6ff)";
    document.body.style.background = bg;
}

function toggleTemperature() {
    isCelsius = !isCelsius;
    updateTemperature();
}

function updateTemperature() {
    elements.temperature.textContent = isCelsius ? `Temp: ${currentTempC}°C` : `Temp: ${currentTempF}°F`;
}