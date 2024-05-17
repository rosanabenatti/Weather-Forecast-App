const timezones = {
  Amsterdam: "Europe/Amsterdam",
  "New York": "America/New_York",
  "Los Angeles": "America/Los_Angeles",
  Tokyo: "Asia/Tokyo",
  Sydney: "Australia/Sydney",
  Sorocaba: "America/Sao_Paulo",
  // Add more cities and their timezones as needed
};

function refreshWeather(response) {
  let temperatureElement = document.querySelector("#temperature");
  let temperature = response.data.temperature.current;
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windSpeedElement = document.querySelector("#wind-speed");
  let timeElement = document.querySelector("#time");
  let iconElement = document.querySelector("#icon");

  cityElement.innerHTML = response.data.city;
  descriptionElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = `${response.data.temperature.humidity}%`;
  windSpeedElement.innerHTML = `${response.data.wind.speed}km/h`;
  temperatureElement.innerHTML = Math.round(temperature);
  iconElement.innerHTML = `<img src="${response.data.condition.icon_url}" class="weather-app-icon" />`;

  let timestamp = response.data.time * 1000; // Convert to milliseconds
  let city = response.data.city;
  let timezone = timezones[city] || "UTC"; // Use the predefined timezone or default to UTC

  let localTime = moment.tz(timestamp, timezone).format("dddd HH:mm");
  timeElement.innerHTML = localTime;
}

function searchCity(city) {
  let apiKey = "b2a5adcct04b33178913oc335f405433";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}`;
  axios.get(apiUrl).then(refreshWeather);
}

function handleSearchSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-form-input");
  searchCity(searchInput.value);
}

let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearchSubmit);

searchCity("Amsterdam");
