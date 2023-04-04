const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const currentWeatherItemEl = document.getElementById("current-weather-items");
const timezone = document.getElementById("time-zone");
const countryEl = document.getElementById("country");
const weatherforecatEl = document.getElementById("weather-forecast");
const currentTempEl = document.getElementById("current-temp");
const currentCity = document.getElementById("city");
const futureForecast = document.getElementById("current_temp");
const otherDayForecast = document.getElementById("weather-forecast");
const backgroundChanger = document.querySelector("body")

const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December'
];

const days = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

const API_KEY = "dbb47095f28e413a89f135950231703";

setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const minutes = time.getMinutes();
  const hourIn12HrsFormat = hour >= 13 ? hour % 12 : hour;
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedMinutes = minutes.toString().padStart(2, '0');
  timeEl.innerHTML = `${hourIn12HrsFormat}:${formattedMinutes} <span id="am-pm">${ampm}</span>`;

  dateEl.innerHTML = days[day] + ", " + date + " " + months[month];

}, 1000)
function getWeatherData() {
  navigator.geolocation.getCurrentPosition((success) => {
    const { latitude, longitude } = success.coords;

    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${latitude},${longitude}&days=12&aqi=yes&alerts=yes`).then(res => res.json()).then(data => {
      // console.log(data);
      showWeatherData(data);
    })
  })
}



function showWeatherData(data) {
  const humidity = data.current.humidity;
  const pressure = data.current.pressure_in;
  const wind_speed = data.current.wind_kph;
  const timearea = data.location.tz_id;
  const nameCountry = data.location.country;
  const city_here = data.location.name;
  const currentRegion = data.location.region;
  const wind_direction = data.current.wind_dir;
  const pm2_5 = data.current.air_quality.pm2_5;
  const pm10 = data.current.air_quality.pm10;
  const so2 = data.current.air_quality.so2;
  const iconToday = data.current.condition.icon;
  const dayTemp = data.forecast.forecastday[0].date;
  const dateTemp = new Date(dayTemp);
  const todayRain = data.forecast.forecastday[0].daily_chance_of_rain;
  //    const dateString = data.location.localtime;
  // const date = new Date(dateString);
  // const timeString = date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit' });
  // console.log(timeString); // "12:48"
  const aqi_so2 = calculateAQI("so2", so2);
  const aqi_pm25 = calculateAQI("pm2_5", pm2_5);
  const aqi_pm10 = calculateAQI("pm10", pm10);

  // get the maximum AQI value
  const max_aqi = Math.max(aqi_so2, aqi_pm25, aqi_pm10);
  let finalAQI;

  // determine air quality based on AQI value
  if (max_aqi <= 50) {
    finalAQI = "Good";
  } else if (max_aqi <= 100) {
    finalAQI = "Moderate";
  } else if (max_aqi <= 150) {
    finalAQI = "Unhealthy for sensitive groups";
  } else if (max_aqi <= 200) {
    finalAQI = "Unhealthy";
  } else if (max_aqi <= 300) {
    finalAQI = "Very Unhealthy";
  } else {
    finalAQI = "Hazardous";
  }

  // function to calculate AQI for a pollutant
  function calculateAQI(pollutant, concentration) {
    let c;
    let c_low;
    let c_high;
    let aqi_low;
    let aqi_high;

    // get the AQI parameters for the pollutant
    switch (pollutant) {
      case "so2":
        c_low = [0, 35, 75, 185, 304, 604, 804, 1004];
        c_high = [34, 74, 184, 303, 603, 803, 1003, 2003];
        aqi_low = [0, 51, 101, 151, 201, 301, 401, 500];
        aqi_high = [50, 100, 150, 200, 300, 400, 500, 500];
        break;
      case "pm2_5":
        c_low = [0, 12.1, 35.5, 55.5, 150.5, 250.5, 350.5, 500.5];
        c_high = [12, 35.4, 55.4, 150.4, 250.4, 350.4, 500.4, 500.4];
        aqi_low = [0, 51, 101, 151, 201, 301, 401, 500];
        aqi_high = [50, 100, 150, 200, 300, 400, 500, 500];
        break;
      case "pm10":
        c_low = [0, 55, 155, 255, 355, 425, 505, 605];
        c_high = [54, 154, 254, 354, 424, 504, 604, 1004];
        aqi_low = [0, 51, 101, 151, 201, 301, 401, 500];
        aqi_high = [50, 100, 150, 200, 300, 400, 500, 500];
        break;
    }

    // find the bracket in which the concentration lies
    for (let i = 0; i < c_low.length; i++) {
      if (concentration >= c_low[i] && concentration <= c_high[i]) {
        c = concentration;
        c_low = c_low[i];
        c_high = c_high[i];
        aqi_low = aqi_low[i];
        aqi_high = aqi_high[i];
        break;
      }
    }
    // calculate AQI
    const aqi = ((aqi_high - aqi_low) / (c_high - c_low)) * (c - c_low) + aqi_low;
    return Math.round(aqi);
  }

if(data.current.is_day===1){
  backgroundChanger.style.background = "url(alessandro-pacilio-dZdYGdDrdfM-unsplash.jpg) no-repeat center center/cover"
}
  timezone.innerHTML = `${timearea}`
  countryEl.innerHTML = `${nameCountry}`
  currentCity.innerHTML = `${city_here}, ${currentRegion}`
  currentWeatherItemEl.innerHTML =
    `<div class="weather-items">
      <div>Humidity</div>
      <div>${humidity}</div>
    </div>
    <div class="weather-items">
      <div>Pressure</div>
      <div>${pressure}</div>
    </div>
    <div class="weather-items">
      <div>Wind</div>
      <div>${wind_speed} KM/H ${wind_direction}</div>
    </div>
    <div class="weather-items">
    <div>AQI</div>
    <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${finalAQI}</div>
    </div>
    `;

  data.forecast.forecastday.forEach((d, idx) => {
    if (idx == 0) {
      const feels = data.current.feelslike_c;
      const isright = data.current.temp_c;
      const condition = data.current.condition.text;
      futureForecast.innerHTML =
        `<div class="today" id="current_temp">
            <img src="https://${iconToday}" alt="weather icon" class="w_icon">
            <div class="other">
                <div class="day">${days[dateTemp.getDay()]}</div>
                <div class="condition">${condition}</div>
                <div class="temp">Temperature:  ${isright}&#176; C</div>
                <div class="temp">Feels Like:  ${feels}&#176; C</div>
                
            </div>`
    }// <div class="temp">Chance of Rain:  ${todayRain}%</div>//for adding today rain functionality
    else {
      const iconOther1 = data.forecast.forecastday[idx].day.condition.icon;
      const iconOther2 = data.forecast.forecastday[idx + 1].day.condition.icon;
      const avgTemp2 = data.forecast.forecastday[idx + 1].day.avgtemp_c;
      const chanceofRain2 = data.forecast.forecastday[idx + 1].day.daily_chance_of_rain;
      const avgTemp1 = data.forecast.forecastday[idx].day.avgtemp_c;
      const chanceofRain1 = data.forecast.forecastday[idx].day.daily_chance_of_rain;
      otherDayForecast.innerHTML = `<div class="weather-forecast" id="weather-forecast">
    <div class="weather-forecast-item">
        <div class="day">${days[dateTemp.getDay() + 1]}</div>
        <div class="today" id="current_temp"><img src="https://${iconOther1}"
                alt="weather icon" class="w_icon"></div>
        <div class="temp">Temperature:  ${avgTemp1}&#176; C</div>
        <div class="temp">Chance of Rain:  ${chanceofRain1}%</div>
    </div>
    <div class="weather-forecast-item">
        <div class="day">${days[dateTemp.getDay() + 2]}</div>
        <div class="today" id="current_temp"><img src="https://${iconOther2}"
                alt="weather icon" class="w_icon"></div>
                <div class="temp">Temperature:  ${avgTemp2}&#176; C</div>
                <div class="temp">Chance of Rain:  ${chanceofRain2}%</div>
    </div>`
    }
  })
}
window.addEventListener('load', function() {
  // Hide the loader once the page has finished loading
  document.querySelector('.pl').style.display = 'none';
});
// show the loader and overlay
document.addEventListener('DOMContentLoaded', function() {
  const loader = document.querySelector('.pl');
  const overlay = document.querySelector('#loader-overlay');
  loader.style.display = 'block';
  overlay.style.display = 'block';
});

// hide the loader and overlay when loading is complete
window.addEventListener('load', function() {
  const loader = document.querySelector('.pl');
  const overlay = document.querySelector('#loader-overlay');
  loader.style.display = 'none';
  overlay.style.display = 'none';
});

getWeatherData();
