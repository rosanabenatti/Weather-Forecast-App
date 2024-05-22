const weatherApiKey = "83f9b46743o5b9ba5591000677t89ea4"; // SheCodes API Key

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
  windSpeedElement.innerHTML = `${response.data.wind.speed} km/h`;
  temperatureElement.innerHTML = Math.round(temperature);
  iconElement.innerHTML = `<img src="${response.data.condition.icon_url}" class="weather-app-icon" />`;

  const lat = response.data.coordinates.latitude;
  const lon = response.data.coordinates.longitude;
  const timestamp = response.data.time * 1000;

  getTimeZone(lat, lon, timestamp, timeElement);
  getForecast(response.data.city);
}

function getTimeZone(lat, lon, timestamp, timeElement) {
  const timeZoneApiUrl = `http://api.timezonedb.com/v2.1/get-time-zone?key=YOUR_TIMEZONE_DB_API_KEY&format=json&by=position&lat=${lat}&lng=${lon}`;

  axios
    .get(timeZoneApiUrl)
    .then((response) => {
      if (response.data && response.data.status === "OK") {
        const timeZone = response.data.zoneName;
        const localTime = new Intl.DateTimeFormat("en-US", {
          weekday: "long",
          hour: "2-digit",
          minute: "2-digit",
          timeZone: timeZone,
        }).format(new Date(timestamp));
        timeElement.innerHTML = localTime;
      } else {
        console.error("Error fetching time zone data:", response.data);
      }
    })
    .catch((error) => {
      console.error("Error fetching time zone data:", error);
    });
}

function searchCity(city) {
  const apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${weatherApiKey}&units=metric`;
  axios.get(apiUrl).then(refreshWeather);
}

function handleSearchSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-form-input");
  searchCity(searchInput.value);
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
}

function getForecast(city) {
  const apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${weatherApiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayForecast(response) {
  let forecastHtml = "";

  response.data.daily.forEach(function (day, index) {
    let dayName = formatDay(day.time);
    forecastHtml += `
      <div class="weather-forecast-day">
        <div class="weather-forecast-date">${dayName}</div>
        <img src="${day.condition.icon_url}" class="weather-forecast-icon" />
        <div class="weather-forecast-temperatures">
          <div class="weather-forecast-temperature">
            <strong>${Math.round(day.temperature.maximum)}º</strong>
          </div>
          <div class="weather-forecast-temperature">${Math.round(
            day.temperature.minimum
          )}º</div>
        </div>
      </div>
    `;
  });

  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = forecastHtml;
}

let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearchSubmit);

searchCity("Amsterdam");
