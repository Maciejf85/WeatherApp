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
let container = document.querySelector('#app');
let cityList = document.querySelector('ul.cityList');
let $btnAddCity = $('#addCity');
let $finder = $('.module.finder');
let $finderHide = $finder.find('button.btn');
let elementId = 0;

$btnAddCity.on('click', function () {
     $finder.show(300);
})
$finderHide.on('click', function () {
     $finder.fadeOut(300);
})

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

     for (let i = 0; i < 10; i++) {
          if (z[i] !== undefined && search.value.length > 0) {
               let li = document.createElement('li');
               li.innerHTML = z[i].name + ', ' + z[i].region_name;
               // li.addEventListener('mouseover', function () {
               // })
               li.addEventListener('click', function () {
                    let weather = new Weather(z[i].lat, z[i].lon, 'Poland', z[i].name);
                    weather.getWeatherDate(display)
                    console.log(this.innerText, z[i].lat, z[i].lon)
                    search.value = this.innerText;
                    cityList.innerHTML = null;
                    setTimeout(function () {
                         search.value = null
                    }, 1000)
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
     const timezone = response.timezone;
     const description = currentDay.summary;
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
     const name = cityName;
     console.log(timezone)


     if (country === "Poland") {
          let air = new Airly(lat, long);
          air.getAirlyData(function (response) {
               if (response.status !== 404) {
                    response.current.values[0] !== undefined ? pm1 = response.current.values[0].value : null
                    response.current.values[1] !== undefined ? pm25 = response.current.values[1].value : null
                    response.current.values[2] !== undefined ? pm10 = response.current.values[2].value : null
                    airAdvice = response.current.indexes[0].advice;
                    airColor = response.current.indexes[0].color;
                    airLevel = response.current.indexes[0].level;

                    array.push(new WeatherItem(icon, timezone, description, sunrise, sunset, temp, tempF, minTemp, maxTemp, humidity, windSpeed, cloudCover, visibility, pressure, name, country, pm1, pm25, pm10, airAdvice, airColor, airLevel));
                    displayOnPage(array, country);
               }
          });
          return;
     }
     array.push(new WeatherItem(icon, timezone, description, sunrise, sunset, temp, tempF, minTemp, maxTemp, humidity, windSpeed, cloudCover, visibility, pressure, name, country, pm1, pm25, pm10, airAdvice, airColor, airLevel));
     displayOnPage(array, country);
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

function displayOnPage(array, country) {
     let source = array[array.length - 1]
     let newElement = module1.cloneNode(true);
     newElement.dataset.id = elementId++;
     let btnClose = newElement.querySelector('.btn--close');
     /**
      * usunięcie elementu z tablicy
      */
     btnClose.addEventListener('click', function () {
          $(this).parent().fadeOut(700)
          array.splice(this.parentElement.dataset.id, 1)
          console.log(array)
     })

     let infoTip = newElement.querySelector('.infoTip');
     array.length > 1 ? infoTip.style.display = 'none' : null;


     newElement.style.display = 'block';
     let temp = newElement.querySelector('.temperature');
     temp.innerHTML = source.temp.toFixed(1) + '&deg;C';
     let name = newElement.querySelector('.city');
     name.innerHTML = source.cityName + '  <span class="btn btn--icon"><i class="material-icons">edit</i></span>';
     let timezone = newElement.querySelector('.timezone');
     console.log(timezone)
     timezone.innerHTML = source.timezone;
     let apparentTemp = newElement.querySelector('.temperature__feel');
     apparentTemp.innerHTML = 'odczuwalna  ' + source.tempF.toFixed(1) + '&deg;C';

     let sunrise = newElement.querySelector('.sunrise__icon');
     sunrise.innerHTML = '<img src="./images/icons2/sunrise.svg" />';
     let sunrise_text = newElement.querySelector('.sunrise__value');
     sunrise_text.innerHTML = source.sunrise;

     let sunset = newElement.querySelector('.sunset__icon');
     sunset.innerHTML = '<img src="./images/icons2/sunset.svg" />';
     let sunset_text = newElement.querySelector('.sunset__value');
     sunset_text.innerHTML = source.sunset;

     let humidity = newElement.querySelector('.humidity__icon');
     humidity.innerHTML = '<img src="./images/icons2/humidity.svg" />';
     let humidity_text = newElement.querySelector('.humidity__value');
     humidity_text.innerHTML = (source.humidity * 100).toFixed(0) + '%'


     let cloudCover = newElement.querySelector('.cloudCover__icon');
     cloudCover.innerHTML = '<img src="./images/icons2/cloudy.svg" />';
     let cloudCover_text = newElement.querySelector('.cloudCover__value');
     cloudCover_text.innerHTML = (source.cloudCover * 100).toFixed(0) + '%'

     let pressure = newElement.querySelector('.pressure__icon');
     pressure.innerHTML = '<img src="./images/icons2/pressure.svg" />';
     let pressure_text = newElement.querySelector('.pressure__value');
     pressure_text.innerHTML = source.pressure + 'hPa';


     let windSpeed = newElement.querySelector('.windSpeed__icon');
     windSpeed.innerHTML = '<img src="./images/icons2/wind.svg" />';
     let windSpeed_text = newElement.querySelector('.windSpeed__value');
     windSpeed_text.innerHTML = source.windSpeed + 'm/s';


     let visibility = newElement.querySelector('.visibility');
     visibility.innerHTML = 'visibility: ' + source.visibility + 'km';
     let iconDescription = newElement.querySelector('.weather__icon__description');
     iconDescription.innerHTML = source.description;



     if (country == 'Poland' && source.pm1 !== undefined && source.pm25 !== undefined && source.pm10 !== undefined) {

          let pm1 = newElement.querySelector('.pm1__icon');
          pm1.innerHTML = 'PM1'
          let pm1_text = newElement.querySelector('.pm1__value');
          pm1_text.innerHTML = source.pm1.toFixed(0); /*' µg/m³ '*/

          let pm25 = newElement.querySelector('.pm25__icon');
          pm25.innerHTML = 'PM2.5'
          let pm25_text = newElement.querySelector('.pm25__value');
          pm25_text.innerHTML = source.pm25.toFixed(0);

          let pm10 = newElement.querySelector('.pm10__icon');
          pm10.innerHTML = 'PM10'
          let pm10_text = newElement.querySelector('.pm10__value');
          pm10_text.innerHTML = source.pm10.toFixed(0);

          let color = newElement.querySelectorAll('.airQuality div');
          color.forEach(item => item.style.background = source.airColor);
     }
     container.appendChild(newElement);

     let random = Math.floor(Math.random() * (700 - 500) + 700);
     setTimeout(function () {
          let item = newElement.querySelector('.loading');
          let infoTip = newElement.querySelector('.infoTip');
          let weather = newElement.querySelector('.weather');
          weather.style.filter = 'none';
          infoTip.style.filter = 'none';
          item.style.display = 'none';
     }, random)
     console.log(array)
}