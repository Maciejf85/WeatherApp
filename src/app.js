import $ from "jquery";
import Weather from "./classes/Weather";
import GeoLocation from "./classes/GeoLocation";
import WeatherItem from "./classes/NewItem";
import Airly from "./classes/Airly";
import MyLocation from "./classes/IpApi";
import Citys from '../citys.json';
import CityList from './classes/CityLocation';

// SCSS
import "./styles/main.scss";


let search = document.getElementById('search');
let submit = document.querySelector('button[type="submit"]');
let city = document.querySelector('.city');
let temperature = document.querySelector('.temperature');
let appTemperature = document.querySelector('.temperature__feel');
let searchModule = document.querySelector('.container > .module');
let container = document.querySelector('#app');
let cityList = document.querySelector('ul.cityList');
let autoCompleteDiv = document.querySelector('.autocomplete');

let module1 = document.querySelector('.item')
let array = [];
let autoComplete = [];


submit.addEventListener("click", findCity);

Citys.forEach(x => {
     x.cities.forEach(item => {
          autoComplete.push(new CityList(item.text_simple, item.text, item.lat, item.lon))
     })
})

search.addEventListener('focus', function () {
     cityList.innerHTML = null;
})
search.addEventListener('keyup', function () {
     cityList.innerHTML = null;
     let z = autoComplete.filter(x => (x.name).toLowerCase().includes(this.value.toLowerCase()));

     for (let i = 0; i < 5; i++) {
          if (z[i] !== undefined) {
               let li = document.createElement('li');
               li.innerHTML = z[i].name + ', ' + z[i].region_name;
               li.addEventListener('mouseover', function () {
                    search.value = this.innerText;
               })
               li.addEventListener('click', function () {
                    let weather = new Weather(z[i].lat, z[i].lon, 'Poland', z[i].name);
                    weather.getWeatherDate(display)
                    console.log(this.innerText, z[i].lat, z[i].lon)
                    cityList.innerHTML = null;
                    setTimeout(function () {
                         search.value = null
                    }, 500)

               })
               cityList.appendChild(li);
          }
     }


});


(function myLocation() {
     let loc = new MyLocation()
     loc.getMyLocation(function (response) {
          let latitude = response.lat;
          let longtitude = response.lon;
          let country = response.country;
          let mobile = response.mobile;
          let cityName = response.city;
          if (mobile !== 'true') {
               let weather = new Weather(latitude, longtitude, country, cityName);
               weather.getWeatherDate(display)
          };
     });
})();

/***
 *  funkcja wywołana na click search
 */
function findCity(e) {
     e.preventDefault();
     let newCity = new GeoLocation(search.value);
     if (search.value.length > 0) {
          search.value = null;
          newCity.getGeoDate(displayResult);
     } else {
          alert('Wpisz miasto');
     }
}

/**
 * Pobranie szerokości geograficznych z Geolocation.js
 */
function displayResult(response) {
     let latitude = response.hits[0].point.lat;
     let longtitude = response.hits[0].point.lng;
     let cityName = response.hits[0].name;
     let country = response.hits[0].country

     let weather = new Weather(latitude, longtitude, country, cityName);
     weather.getWeatherDate(display);
}

/**
 * Pobranie odpowiedzi z Weather.js
 */
function display(response, lat, long, country, cityName) {
     let currentDay = response.daily.data[0];
     let pm1;
     let pm25;
     let pm10;
     let airAdvice;
     let airColor;
     let airLevel;
     const icon = currentDay.icon;
     const sunrise = calcUnix(currentDay.sunriseTime, 'time');
     const sunset = calcUnix(currentDay.sunsetTime, 'time');
     const temp = response.currently.temperature;
     const tempF = response.currently.apparentTemperature;
     const minTemp = currentDay.temperatureMin;
     const maxTemp = currentDay.temperatureMax;
     const humidity = currentDay.humidity;
     const windSpeed = currentDay.windSpeed;
     const cloudCover = currentDay.cloudCover;
     const visibility = currentDay.visibility;
     const pressure = currentDay.pressure;
     let name = cityName


     if (country === "Poland") {
          let air = new Airly(lat, long);
          air.getAirlyData(function (response) {
               if (response.status !== 404) {
                    pm1 = response.current.values[0].value;
                    pm25 = response.current.values[1].value;
                    pm10 = response.current.values[2].value;
                    airAdvice = response.current.indexes[0].advice;
                    airColor = response.current.indexes[0].color;
                    airLevel = response.current.indexes[0].level;

                    array.push(new WeatherItem(icon, sunrise, sunset, temp, tempF, minTemp, maxTemp, humidity, windSpeed, cloudCover, visibility, pressure, name, pm1, pm25, pm10, airAdvice, airColor, airLevel));
                    displayOnPage(array);
               }
          });
          return;
     }
     array.push(new WeatherItem(icon, sunrise, sunset, temp, tempF, minTemp, maxTemp, humidity, windSpeed, cloudCover, visibility, pressure, name, pm1, pm25, pm10, airAdvice, airColor, airLevel));
     displayOnPage(array);


}

/**
 * Funkcja zwracająca dane z czasu Unix
 */
function calcUnix(time, type) {
     if (type === 'time') {
          let date = new Date(time * 1000);
          let h = date.getHours();
          let m = date.getMinutes();
          return `${h}:${m}`;
     }
     return 'default value';
}

function displayOnPage(array) {
     let source = array[array.length - 1]
     let newElement = module1.cloneNode(true);
     newElement.style.display = 'block';
     let temp = newElement.querySelector('.temperature');
     temp.innerHTML = source.temp.toFixed(1) + '&deg;C';
     let name = newElement.querySelector('.city');
     name.innerHTML = source.cityName;
     let apparentTemp = newElement.querySelector('.temperature__feel');
     apparentTemp.innerHTML = 'odczuwalna  ' + source.tempF.toFixed(1) + '&deg;C';
     let sunrise = newElement.querySelector('.sunrise');
     sunrise.innerHTML = 'sunrise: ' + source.sunrise;
     let sunset = newElement.querySelector('.sunset');
     sunset.innerHTML = 'sunset: ' + source.sunset;
     let humidity = newElement.querySelector('.humidity');
     humidity.innerHTML = 'humidity: ' + source.humidity * 100 + '%';
     let pressure = newElement.querySelector('.pressure');
     pressure.innerHTML = 'pressure: ' + source.pressure + 'hPa';
     let windSpeed = newElement.querySelector('.windSpeed');
     windSpeed.innerHTML = 'wind speed: ' + source.windSpeed + 'm/s';
     let visibility = newElement.querySelector('.visibility');
     visibility.innerHTML = 'visibility: ' + source.visibility + 'km';
     let pm1 = newElement.querySelector('.pm1');
     pm1.innerHTML = 'PM1: ' + source.pm1.toFixed(0);
     let pm25 = newElement.querySelector('.pm25');
     pm25.innerHTML = 'PM2.5: ' + source.pm25.toFixed(0);
     let pm10 = newElement.querySelector('.pm10');
     pm10.innerHTML = 'PM10: ' + source.pm10.toFixed(0);
     let color = newElement.querySelector('.airQuality');
     color.style.background = source.airColor;



     container.appendChild(newElement)

}