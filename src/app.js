import $ from "jquery";
import Weather from "./classes/Weather";
import GeoLocation from "./classes/GeoLocation";
import WeatherItem from "./classes/newItem";
import Airly from "./classes/Airly";

// SCSS
import "./styles/main.scss";

class obiekt {
     constructor(temp) {
          this.temp = temp
     }
}
let search = document.getElementById('search');
let submit = document.querySelector('button[type="submit"]');
let city = document.querySelector('.city');
let temperature = document.querySelector('.temperature');
let appTemperature = document.querySelector('.temperature__feel');

let array = [];

submit.addEventListener("click", findCity);

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

     city.innerHTML = cityName;

     let weather = new Weather(latitude, longtitude);
     let air = new Airly(latitude, longtitude);

     air.getAirlyData();
     weather.getWeatherDate(display);
}

/**
 * Pobranie odpowiedzi z Weather.js
 */
function display(response) {
     let currentDay = response.daily.data[0];

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

     array.push(new WeatherItem(icon, sunrise, sunset, temp, tempF, minTemp, maxTemp, humidity, windSpeed, cloudCover, visibility, pressure))


     console.log(array[0].displayVal())
}

function calcUnix(time, sort) {
     if (sort === 'time') {
          let date = new Date(time * 1000);
          let h = date.getHours();
          let m = date.getMinutes();
          return `${h}:${m}`;
     }
     return 'default value';
}