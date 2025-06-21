const API_KEY = "9236695e01a14c0fa0a102849252106"; // Replace this with your WeatherAPI key

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locBtn = document.getElementById("locBtn");
const recentCitiesEl = document.getElementById("recentCities");
const recentDropdown = document.getElementById("recentDropdown");
const weatherInfo = document.getElementById("weatherInfo");
const forecastContainer = document.getElementById("forecast");

function fetchWeather(city) {
  if (!city) return alert("Please enter a city name.");

  const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=5&aqi=no&alerts=no`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.error) throw new Error(data.error.message);
      displayCurrentWeather(data);
      displayForecast(data);
      saveRecentCity(city);
    })
    .catch(err => alert("Error: " + err.message));
}

function fetchByLocation() {
  if (!navigator.geolocation) return alert("Geolocation not supported.");

  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude, longitude } = pos.coords;
    const loc = `${latitude},${longitude}`;
    fetchWeather(loc);
  });
}

function displayCurrentWeather(data) {
  document.getElementById("location").textContent = `${data.location.name}, ${data.location.country}`;
  document.getElementById("description").textContent = data.current.condition.text;
  document.getElementById("temperature").textContent = `🌡️ Temp: ${data.current.temp_c}°C`;
  document.getElementById("humidity").textContent = `💧 Humidity: ${data.current.humidity}%`;
  document.getElementById("wind").textContent = `💨 Wind: ${data.current.wind_kph} km/h`;
  document.getElementById("weatherIcon").src = `https:${data.current.condition.icon}`;

  weatherInfo.classList.remove("hidden");
}

function displayForecast(data) {
  forecastContainer.innerHTML = "";
  data.forecast.forecastday.forEach(day => {
    forecastContainer.innerHTML += `
      <div class="bg-white rounded-lg p-4 shadow text-center">
        <h3 class="font-semibold mb-1">${day.date}</h3>
        <img src="https:${day.day.condition.icon}" class="mx-auto" />
        <p>${day.day.condition.text}</p>
        <p>🌡 ${day.day.avgtemp_c}°C</p>
        <p>💧 ${day.day.avghumidity}%</p>
        <p>💨 ${day.day.maxwind_kph} km/h</p>
      </div>
    `;
  });

  forecastContainer.classList.remove("hidden");
}

function saveRecentCity(city) {
  let cities = JSON.parse(localStorage.getItem("recentCities")) || [];
  cities = [city, ...cities.filter(c => c !== city)].slice(0, 5);
  localStorage.setItem("recentCities", JSON.stringify(cities));
  populateRecentCities();
}

function populateRecentCities() {
  const cities = JSON.parse(localStorage.getItem("recentCities")) || [];
  if (cities.length === 0) {
    recentCitiesEl.classList.add("hidden");
    return;
  }

  recentDropdown.innerHTML = `<option disabled selected>Select a recent city</option>`;
  cities.forEach(city => {
    recentDropdown.innerHTML += `<option value="${city}">${city}</option>`;
  });
  recentCitiesEl.classList.remove("hidden");
}

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  fetchWeather(city);
});

locBtn.addEventListener("click", fetchByLocation);

recentDropdown.addEventListener("change", () => {
  fetchWeather(recentDropdown.value);
});

populateRecentCities();

