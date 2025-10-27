// === DOM ELEMENTS ===
const Cityinput = document.getElementById("cityinput");
const Searchbtn = document.getElementById("searchbtn");
const CityName = document.getElementById("cityname");
const Icon = document.getElementById("icon");
const Temp = document.getElementById("temp");
const Meta = document.getElementById("meta");
const errorAlert = document.getElementById("errorAlert");
const Humidity = document.getElementById("humidity");
const Wind = document.getElementById("wind");

let lastData = null; // cache for last search

// === API KEY ===
const key = '823e0f24b43f6a7dbat32b0c74o240bf';// make sure this is correct!

// 823e0f24b43f6a7dbat32b0c74o240bf

// === ICON MAP ===
const FORECAST = {
  "clear-sky": { text: "Clear sky", icon: "🌞" },
  "few-clouds": { text: "Few clouds", icon: "🌤️" },
  "scattered-clouds": { text: "Scattered clouds", icon: "⛅" },
  "showers": { text: "Showers", icon: "🌦️" },
  "rain": { text: "Rain", icon: "🌧️" },
  "thunderstorm": { text: "Thunderstorm", icon: "⛈️" },
  "snow": { text: "Snow", icon: "❄️☃️" },
  "mist": { text: "Mist", icon: "☁️"},
  "broken-clouds": { text: "Overcast clouds", icon: "☁️"}
};

// === API CALL BY CITY ===
async function FindWeatherbyLocation(city) {
  const url = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${key}`;
  const outcome = await fetch(url);
  if (!outcome.ok) {
    if (outcome.status === 404) throw new Error("City not found");
    throw new Error("Network error");
  }
  const data = await outcome.json();
  if (data.error) throw new Error(data.error);
  return data;
}

// === API CALL BY COORDS (optional) ===
async function FindWeatherbyCoords(lat, lon) {
  const url = `https://api.shecodes.io/weather/v1/current?lon=${lon}&lat=${lat}&key=${key}`;
  const outcome = await fetch(url);
  if (!outcome.ok) throw new Error("Coordinates not found");
  const data = await outcome.json();
  if (data.error) throw new Error(data.error);
  return data;
}

// === ERROR HANDLER ===
function setError(message) {
  errorAlert.textContent = message;
  errorAlert.classList.toggle("d-none", !message);
}

// === RENDER WEATHER ===
function renderCurrent(weather) {
  const conditionRaw = weather.condition.icon;
  const condition = conditionRaw.replace(/-(day|night)$/, "");
  const map = FORECAST[condition] || { text: "Unknown", icon: "❔" };
  const descText = weather.condition.description || map.text.toLowerCase();

  CityName.textContent = weather.city;
  Meta.textContent = `${dayjs(weather.time * 1000).format("ddd HH:mm")}, ${descText}`;
  Temp.textContent = Math.round(weather.temperature.current);
  Humidity.textContent = weather.temperature.humidity + "%";
  Wind.textContent = weather.wind.speed + " km/h";
  Icon.textContent = map.icon;
}

// === SEARCH FUNCTION ===
async function search(city) {
  setError("");
  try {
    const weather = await FindWeatherbyLocation(city);
    lastData = weather;
    renderCurrent(weather);
  } catch (err) {
    setError(err.message || "Something went wrong");
  }
}

// === EVENT HANDLER ===
Searchbtn.addEventListener("click", (e) => {
  e.preventDefault(); // prevent form reload
  const q = Cityinput.value.trim();
  if (q) search(q);
});

// === DEFAULT LOAD ===
search("Paris");