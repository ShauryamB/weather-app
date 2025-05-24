const userLocation = document.getElementById("userLocation"),
  converter = document.getElementById("converter"),
  weatherIcon = document.querySelector(".weatherIcon"),
  temperature = document.querySelector(".temperature"),
  feelsLike = document.querySelector(".feelsLike"),
  description = document.querySelector(".description"),
  date = document.querySelector(".date"),
  city = document.querySelector(".city"),
  HValue = document.getElementById("HValue"),
  WValue = document.getElementById("WValue"),
  SRValue = document.getElementById("SRValue"),
  SSValue = document.getElementById("SSValue"),
  CValue = document.getElementById("CValue"),
  UVValue = document.getElementById("UVValue"),
  PValue = document.getElementById("PValue");

const WEATHER_API_ENDPOINT = "https://api.weatherapi.com/v1/current.json";
const WEATHER_FORECAST_ENDPOINT = "https://api.weatherapi.com/v1/forecast.json";
const API_KEY = "8088c009490e4b6289d60503252205";

function findUserLocation() {
  const cityName = userLocation.value;

  const currentUrl = `${WEATHER_API_ENDPOINT}?key=${API_KEY}&q=${cityName}`;
  const forecastUrl = `${WEATHER_FORECAST_ENDPOINT}?key=${API_KEY}&q=${cityName}&days=1`;

  fetch(currentUrl)
    .then((response) => response.json())
    .then((currentData) => {
      if (currentData.error) {
        alert(currentData.error.message);
        throw new Error(currentData.error.message);
      }

      city.innerHTML =
        currentData.location.name + ", " + currentData.location.country;
      weatherIcon.style.backgroundImage = `url("https:${currentData.current.condition.icon}")`;

      let temp = currentData.current.temp_c;
      if (converter.value == "C") {
        temperature.innerHTML = currentData.current.temp_c + " &deg;C";
        feelsLike.innerHTML =
          "Feels Like " + currentData.current.feelslike_c + " &deg;C";
      } else if (converter.value == "F") {
        temperature.innerHTML = currentData.current.temp_f + " &deg;F";
        feelsLike.innerHTML =
          "Feels Like " + currentData.current.feelslike_f + " &deg;F";
      }



      let cards = document.getElementsByClassName("cards");
      let bgColor = "";

      if (temp < 0) bgColor = "#e0f7fa";
      else if (temp < 10) bgColor = "#81d4fa";
      else if (temp < 20) bgColor = "#64b5f6";
      else if (temp < 30) bgColor = "#aed581";
      else if (temp < 35) bgColor = "#ffb74d";
      else if (temp < 40) bgColor = "#ff8a65";
      else bgColor = "#e53935";

      for (let card of cards) {
        card.style.backgroundColor = bgColor;
      }

      description.innerHTML =
        `<i class="fa-brands fa-cloudversify"></i> &nbsp;` +
        currentData.current.condition.text;

      const now = new Date(currentData.location.localtime);

      const options = {
        weekday: "long",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };

      const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
        now
      );
      date.innerHTML = formattedDate;

      HValue.innerHTML = Math.round(currentData.current.humidity) + "%";
      WValue.innerHTML = Math.round(currentData.current.wind_kph) + " kph";
      CValue.innerHTML = currentData.current.cloud + "%";
      UVValue.innerHTML = currentData.current.uv;
      PValue.innerHTML = currentData.current.pressure_mb + " mbar";

      return fetch(forecastUrl);
    })
    .then((response) => response.json())
    .then((forecastData) => {
      if (forecastData.error) {
        alert(forecastData.error.message);
        return;
      }

      SRValue.innerHTML = forecastData.forecast.forecastday[0].astro.sunrise;
      SSValue.innerHTML = forecastData.forecast.forecastday[0].astro.sunset;

      console.log("Forecast data:", forecastData);
    })
    .catch((err) => console.error("API error:", err));
}
