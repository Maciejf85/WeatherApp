import $ from "jquery";
import Weather from "./classes/Weather";
import GeoLocation from "./classes/GeoLocation";
import WeatherItem from "./classes/newItem";

// SCSS
import "./styles/main.scss";

let search = document.getElementById('search');
let submit = document.querySelector('button[type="submit"]');
let city = document.querySelector('.city');
let temperature = document.querySelector('.temperature');

submit.addEventListener("click", findCity);


function findCity(e) {
     e.preventDefault();
     let newCity = new GeoLocation(search.value);
     search.value = null;
     newCity.getGeoDate(displayResult)
}

function displayResult(response) {
     let latitude = response.hits[0].point.lat;
     let longtitude = response.hits[0].point.lng;
     let cityName = response.hits[0].name;

     city.innerHTML = cityName;

     let weather = new Weather(latitude, longtitude)
     weather.getWeatherDate(display)
}

function display(response) {
     for (let key in response) {
          console.log(response[key])
     }
     temperature.innerHTML = response.currently.temperature + '&deg;C';

}