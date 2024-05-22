const weatherApiKey = "83f9b46743o5b9ba5591000677t89ea4";

function refreshWeather(response) {
  let temperatureElement = document.querySelector("#temperature");
  let temperature = response.data.temperature.current;
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windSpeedElement = document.querySelector("#wind-speed");
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

  displayLocalTime(lat, lon, timestamp);
  getForecast(response.data.city);
}

function displayLocalTime(lat, lon, timestamp) {
  const localTime = moment(timestamp)
    .utcOffset(0)
    .add(lon / 15, "hours")
    .format("dddd HH:mm");
  document.querySelector("#time").innerHTML = localTime;
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

function getForecast(city) {
  const apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${weatherApiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayForecast(response) {
  let forecastHtml = "";

  response.data.daily.forEach(function (day, index) {
    let dayName = moment().add(index, "days").format("ddd");

    forecastHtml += `
      <div class="weather-forecast-day">
        <div class="weather-forecast-date">${dayName}</div>
        <div class="weather-forecast-icon"><img src="${
          day.condition.icon_url
        }" class="weather-app-icon"/></div>
        <div class="weather-forecast-temperatures">
          <div class="weather-forecast-temperature">
            <strong>${Math.round(day.temperature.maximum)}°</strong>
            <span>${Math.round(day.temperature.minimum)}°</span>
          </div>
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
