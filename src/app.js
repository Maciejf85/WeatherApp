import $ from "jquery";
import Weather from "./classes/Weather";
import GeoLocation from "./classes/GeoLocation";
import WeatherItem from "./classes/NewItem";
import Airly from "./classes/Airly";
import MyLocation from "./classes/IpApi";
import Citys from '../citys.json';
import CityList from './classes/CityLocation';
import WorldTime from './classes/WorldTime';


// SCSS
import "./styles/main.scss";
import icons from './classes/icons';
import weekDays from './classes/WeekDays';


let search = document.getElementById('search');
let submit = document.querySelector('button[type="submit"]');
let cityList = document.querySelector('ul.cityList');
let $btnAddCity = $('#addCity');
let $finder = $('.module.finder');
let $finderHide = $finder.find('button.btn');
let id = 0;

$btnAddCity.on('click', function () {
     $finder.show(300);
})
$finderHide.on('click', function () {
     $finder.fadeOut(300);
})

let array = [];
let autoComplete = [];

/**
 * odpalenie szukajki
 */
submit.addEventListener("click", findCity);

/**
 * przepisanie z pliku citys.json 
 * nazw miast i geolokacji do tablicy autoComplete
 */
Citys.forEach(x => {
     x.cities.forEach(item => {
          autoComplete.push(new CityList(item.text_simple, item.text, item.lat, item.lon))
     })
})


/**
 * czyszczenie formularza
 */
search.addEventListener('focus', function () {
     cityList.innerHTML = null;

})
/**
 * odpalenie autocomplete
 */
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

/**
 * odpalenie autolokacji
 */
(function myLocation() {
     let location = new MyLocation()
     location.getMyLocation(function (response) {
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
})

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
     let type = 'search';

     let weather = new Weather(latitude, longtitude, country, cityName);
     weather.getWeatherDate(display)
}

/**
 * Pobranie odpowiedzi z Weather.js
 */
function display(response, lat, long, country, cityName) {

     let currentDay = response.daily.data[0];
     let hourly = response.hourly.data;

     let pm1;
     let pm25;
     let pm10;
     let airAdvice;
     let airColor;
     let airLevel;
     let currentTime;
     let day;
     const offset = response.offset;
     const icon = currentDay.icon;
     const timeZone = response.timezone;
     const description = currentDay.summary;
     const sunrise = calcUnix(currentDay.sunriseTime, offset, 'time');
     const sunset = calcUnix(currentDay.sunsetTime, offset, 'time');
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
     let currentId = id++;


     createBaseItem(currentId); //wywołanie funkcji która buduje item



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


                    array.push(new WeatherItem(currentId, icon, timeZone, day, currentTime, description, sunrise, sunset, temp, tempF, minTemp, maxTemp, humidity, windSpeed, cloudCover, visibility, pressure, name, country, pm1, pm25, pm10, airAdvice, airColor, airLevel, hourly, offset));
                    getCurrentTime(currentId);
               }
          });
          return;
     }
     array.push(new WeatherItem(currentId, icon, timeZone, day, currentTime, description, sunrise, sunset, temp, tempF, minTemp, maxTemp, humidity, windSpeed, cloudCover, visibility, pressure, name, country, pm1, pm25, pm10, airAdvice, airColor, airLevel, hourly, offset));
     getCurrentTime(currentId);
};

function getCurrentTime(currentId) {
     let thisItem = array.filter(x => (x.id == currentId));
     let localTime = new WorldTime(thisItem[0].timezone);

     localTime.getTime(function (response) {
          let offset = parseInt(response.utc_offset);
          let time = new Date(response.unixtime * 1000);
          let localT = time.getUTCHours() + offset;
          let localHours = localT > 24 ? localT -= 24 : localT;
          let localMinutes = time.getMinutes();
          let localDay = weekDays[response.day_of_week - 1];
          localHours < 10 ? localHours = `0${localHours}` : `${localHours}`
          localMinutes < 10 ? localMinutes = `0${localMinutes}` : `${localMinutes}`
          thisItem[0].day = localDay;
          thisItem[0].time = `${localDay}  ${localHours}:${localMinutes}`;
          thisItem[0].offset = offset;
          displayOnPage(thisItem[0]);

     });
}


/**
 * Funkcja zwracająca dane z czasu Unix
 */
function calcUnix(time, offset, type) {
     if (type === 'time') {

          let date = new Date(time * 1000);
          let localT = date.getUTCHours() + offset;
          let h = localT > 24 ? localT -= 24 : localT;
          h < 10 ? h = `0${h}` : h;
          let m = date.getMinutes();
          m < 10 ? m = `0${m}` : m;
          return `${h}:${m}`;
     }
     return 'default value';
}


/**
 * 
 *  Wyrenderowanie elementów z tablicy
 */

function displayOnPage(currentNewElement) {
     console.time('render')
     let $sourceData = $(currentNewElement);
     let $id = $sourceData.attr('id');
     let $element = $("[data-id=" + $id + "]");

     let $btnClose = $('<button>', {
          class: 'btn btn--icon btn--close'
     })
     let $btnCloseIcon = $('<i>', {
          class: 'material-icons',
          text: 'close'
     });
     $btnCloseIcon.appendTo($btnClose);
     $btnClose.appendTo($element);

     let $autoLocation = $('<div>', {
          class: 'infoTip',
          text: 'Twoja lokalizacja'
     });
     let $infoTim = $('<i>', {
          class: 'material-icons',
          text: 'my_location'
     });
     $infoTim.appendTo($autoLocation);
     $autoLocation.appendTo($element);

     let $weather = $('<div>', {
          class: 'weather'
     });
     let $weatherIcon = $('<div>', {
          class: 'weather__icon'
     });


     let currentIcon = icons.filter(x => x.name == $sourceData.attr('icon'));
     let $weatherIconImg = $('<img>', {
          src: currentIcon[0].url
     })
     let $weatherDesc = $('<div>', {
          class: 'weather__icon__description',
          text: $sourceData[0].description
     });
     $weatherIconImg.appendTo($weatherIcon);
     $weatherDesc.appendTo($weatherIcon);
     $weatherIcon.appendTo($weather);
     $weather.appendTo($element);

     let $weatherInfo = $('<div>', {
          class: 'weather__info'
     });
     let $weatherInfoCity = $('<div>', {
          class: 'city'
     });
     $weatherInfoCity.text(`${$sourceData[0].cityName} `);
     let $weatherInfoSpan = $('<span>', {
          class: 'btn btn--icon'
     });
     let $weatherInfoIcon = $('<i>', {
          class: 'material-icons',
          text: 'edit'
     });

     let $weatherTimezone = $('<div>', {
          class: 'timezone',
          text: $sourceData[0].time
     });
     let $weatherTemperature = $('<div>', {
          class: 'temperature',
          text: `${$sourceData[0].temp.toFixed(1)} °C`
     });
     let $weatherTemperature__feel = $('<div>', {
          class: 'temperature__feel',
          text: `odczuwalna ${$sourceData[0].tempF.toFixed(1)}°C`
     });

     let $weatherData = $('<div>', {
          class: 'weather__data'
     });



     /**
      * weather left
      */
     let $weatherDataLeft = $('<div>', {
          class: 'weather__data__left'
     });

     /**
      * sunrise
      */
     let $weatherSunrise = $('<div>', {
          class: 'sunrise'
     });
     let $sunriseIcon = $('<span>', {
          class: 'sunrise__icon'
     });
     let $sunriseIconImg = $('<img>', {
          src: './images/icons2/sunrise.svg'
     });

     let $sunriseValue = $('<span>', {
          class: 'sunrise__value',
          text: $sourceData[0].sunrise
     });


     /**
      * sunset
      */
     let $weatherSunset = $('<div>', {
          class: 'sunset'
     });
     let $sunsetIcon = $('<span>', {
          class: 'sunset__icon'
     });
     let $sunsetIconImg = $('<img>', {
          src: './images/icons2/sunset.svg'
     });

     let $sunsetValue = $('<span>', {
          class: 'sunset__value',
          text: $sourceData[0].sunset
     });

     /**
      * humidity
      */
     let $weatherHumidity = $('<div>', {
          class: 'humidity'
     });
     let $humidityIcon = $('<span>', {
          class: 'humidity__icon'
     });
     let $humidityIconImg = $('<img>', {
          src: './images/icons2/humidity.svg'
     });

     let $humidityValue = $('<span>', {
          class: 'humidity__value',
          text: `${$sourceData[0].humidity * 100}%`
     });

     let $freeInfo = $('<div>', {
          class: 'humidity',
          text: 'undefined'
     });

     /**
      * weather info
      */
     $weatherInfoIcon.appendTo($weatherInfoSpan);
     $weatherInfoSpan.appendTo($weatherInfoCity);
     $weatherInfoCity.appendTo($weatherInfo);
     $weatherTimezone.appendTo($weatherInfo);
     $weatherTemperature.appendTo($weatherInfo);
     $weatherTemperature__feel.appendTo($weatherInfo)
     $weatherInfo.appendTo($weather);


     /**
      * weather data left
      */
     // sunrise
     $sunriseIconImg.appendTo($sunriseIcon);
     $sunriseIcon.appendTo($weatherSunrise);
     $sunriseValue.appendTo($weatherSunrise);
     $weatherSunrise.appendTo($weatherDataLeft);
     // sunset
     $sunsetIconImg.appendTo($sunsetIcon);
     $sunsetIcon.appendTo($weatherSunset);
     $sunsetValue.appendTo($weatherSunset);
     $weatherSunset.appendTo($weatherDataLeft);
     // humidity
     $humidityIconImg.appendTo($humidityIcon);
     $humidityIcon.appendTo($weatherHumidity);
     $humidityValue.appendTo($weatherHumidity);
     $weatherHumidity.appendTo($weatherDataLeft);
     //free info
     $freeInfo.appendTo($weatherDataLeft);

     /**
      * weather data right
      */
     let $weatherDataRight = $('<div>', {
          class: 'weather__data__right'
     });

     /**
      * pressure
      */
     let $weatherPressure = $('<div>', {
          class: 'pressure'
     });
     let $pressureIcon = $('<span>', {
          class: 'pressure__icon'
     });
     let $pressureIconImg = $('<img>', {
          src: './images/icons2/pressure.svg'
     });

     let $pressureValue = $('<span>', {
          class: 'sunrise__value',
          text: `${$sourceData[0].pressure} hPa`
     });

     /**
      * windSpeed
      */
     let $weatherWind = $('<div>', {
          class: 'windSpeed'
     });
     let $windIcon = $('<span>', {
          class: 'windSpeed__icon'
     });
     let $windIconImg = $('<img>', {
          src: './images/icons2/wind.svg'
     });

     let $windValue = $('<span>', {
          class: 'windSpeed__value',
          text: `${(($sourceData[0].windSpeed*3600)/1000).toFixed(1)} km/h`
     });

     /**
      * cloudCover
      */
     let $weatherCloud = $('<div>', {
          class: 'cloudCover'
     });
     let $cloudIcon = $('<span>', {
          class: 'cloudCover__icon'
     });
     let $cloudIconImg = $('<img>', {
          src: './images/icons2/cloudy.svg'
     });

     let $cloudValue = $('<span>', {
          class: 'cloudCover__value',
          text: `${($sourceData[0].cloudCover*100).toFixed(1)} %`
     });

     /**
      * visibility
      */
     let $weatherVisibility = $('<div>', {
          class: 'windSpeed'
     });
     let $visibilityIcon = $('<span>', {
          class: 'windSpeed__icon'
     });
     let visibility = $sourceData[0].visibility > 10 ? '+10' : $sourceData[0].visibility;

     let $visibilityValue = $('<span>', {
          class: 'windSpeed__value',
          text: `visibility: ${visibility} km`
     });

     //pressure
     $pressureIconImg.appendTo($pressureIcon);
     $pressureIcon.appendTo($weatherPressure);
     $pressureValue.appendTo($weatherPressure);
     //windSpeed
     $windIconImg.appendTo($windIcon);
     $windIcon.appendTo($weatherWind);
     $windValue.appendTo($weatherWind);
     //cloudCover
     $cloudIconImg.appendTo($cloudIcon);
     $cloudIcon.appendTo($weatherCloud);
     $cloudValue.appendTo($weatherCloud);
     //visibility
     $visibilityIcon.appendTo($weatherVisibility);
     $visibilityValue.appendTo($weatherVisibility);


     $weatherPressure.appendTo($weatherDataRight);
     $weatherWind.appendTo($weatherDataRight);
     $weatherCloud.appendTo($weatherDataRight);
     $weatherVisibility.appendTo($weatherDataRight);


     $weatherDataLeft.appendTo($weatherData);
     $weatherDataRight.appendTo($weatherData);
     $weatherData.appendTo($weather);


     if ($sourceData[0].country === 'Poland' && $sourceData[0].pm1 !== undefined && $sourceData[0].pm25 !== undefined && $sourceData[0].pm10 !== undefined) {

          var $airQuality = $('<div>', {
               class: 'airQuality'
          });

          let $pm1 = $('<div>', {
               class: 'pm1',
               text: 'PM1'
          });
          let $pm1Icon = $('<div>', {
               class: 'pm1__icon'
          });
          let $pm1Value = $('<div>', {
               class: 'pm1__value',
               text: `${Math.round($sourceData[0].pm1)}`
          });


          let $pm25 = $('<div>', {
               class: 'pm25',
               text: 'PM2.5'
          });
          let $pm25Icon = $('<div>', {
               class: 'pm25__icon'
          });
          let $pm25Value = $('<div>', {
               class: 'pm25__value',
               text: `${Math.round($sourceData[0].pm25)}`
          });


          let $pm10 = $('<div>', {
               class: 'pm10',
               text: 'PM10'
          });
          let $pm10Icon = $('<div>', {
               class: 'pm10__icon'
          });
          let $pm10Value = $('<div>', {
               class: 'pm10__value',
               text: `${Math.round($sourceData[0].pm10)}`
          });

          $pm1Icon.appendTo($pm1);
          $pm1Value.appendTo($pm1);
          $pm1.appendTo($airQuality)


          $pm25Icon.appendTo($pm25);
          $pm25Value.appendTo($pm25);
          $pm25.appendTo($airQuality)


          $pm10Icon.appendTo($pm10);
          $pm10Value.appendTo($pm10);
          $pm10.appendTo($airQuality)

          $airQuality.appendTo($weather);
     }

     let counter = 0;

     let $forecast = $('<div>', {
          class: 'forecast'
     });

     for (let i = 0; i < 6; i++) {

          let $div0 = $('<div>', {
               class: 'item'
          });
          let $div1 = $('<div>', {
               class: 'item--icon'
          });
          let $div2 = $('<div>', {
               class: 'item--precip'
          });
          let $div3 = $('<div>', {
               class: 'item--temperature'
          });
          let $div4 = $('<div>', {
               class: 'item--hours'
          });
          let $img1 = $('<img>');
          let $img2 = $('<img>');


          let $icon = $sourceData[0].hourly[2 + counter].icon;
          let precip = $sourceData[0].hourly[2 + counter].precipProbability;
          let temp = $sourceData[0].hourly[2 + counter].temperature;
          let time = $sourceData[0].hourly[2 + counter].time;

          let currentIcon = icons.filter(x => x.name == $icon);

          $img1.attr('src', currentIcon[0].url);
          $img2.attr('src', './images/icons2/water.svg');

          let offset = $sourceData[0].offset;
          let h = new Date(time * 1000);
          let localH = h.getUTCHours() + offset;
          let hours = localH >= 24 ? localH -= 24 : localH;
          hours = localH < 0 ? localH += 24 : localH;
          (hours < 10) ? hours = `0${hours}:00`: hours = `${hours}:00`;

          $div1.append($img1);
          $div1.appendTo($div0);
          $div2.append($img2);
          $div2.html(`${precip.toFixed(1)} %`);
          $div2.appendTo($div0);
          $div3.text(`${temp.toFixed(1)}°C`)
          $div3.appendTo($div0);
          $div4.text(hours)
          $div4.appendTo($div0);
          $div0.appendTo($forecast);
          counter += 2;
     }

     $forecast.appendTo($weather)

     let $showButton = $('<button>', {
          class: 'btn btn--icon btn--more'
     });
     let $showButtonIcon = $('<i>', {
          class: 'material-icons',
          text: 'expand_more'
     });
     $showButtonIcon.appendTo($showButton);
     $showButton.appendTo($element);




     $btnClose.on('click', function () {
          $(this).parent().fadeOut(500, function () {
               $(this).remove();
          });
          array.forEach((x, i) => {
               if (x.id == this.parentElement.dataset.id) {
                    array.splice(i, 1);
               }
          });
     });


     $showButton.on('click', function () {
          let $thisForecast = $showButton.parent().find('.forecast');
          if ($thisForecast.css('display') == 'none') {
               $thisForecast.css('display', 'flex');
               $showButton.toggleClass('up');
               $($element).animate({
                    height: '105%'
               })
          } else {
               $showButton.toggleClass('up');
               $thisForecast.hide(300);
               $($element).animate({
                    height: '100%',
               })
          }

     })

     let $color = $element.find('.airQuality div');
     $color.each((index, item) => $(item).css('background', $sourceData[0].airColor));


     let $item = $('.loading');

     $item.fadeOut(1000);
     setTimeout(function () {
          $weather.css('filter', 'none');
          $autoLocation.css('filter', 'none');
     }, 500)

     console.log(array)
     console.timeEnd('render')
}

/**
 * creating base module
 */
function createBaseItem(currentId) {
     let $container = $('#app');
     let $newModule = $('<div>', {
          class: 'module module--item'
     });
     $newModule.attr("data-id", currentId);
     let $loaderPage = $('<div>', {
          class: 'loading'
     });
     let $loaderContainer = $('<div>', {
          class: 'loaderItem'
     });
     let $loaderAnimation = $('<div>', {
          class: 'loader'
     });
     let $loaderText = $('<div>', {
          class: 'loadText'
     }).text('loading');

     $loaderAnimation.appendTo($loaderContainer);
     $loaderText.appendTo($loaderContainer);
     $loaderContainer.appendTo($loaderPage);
     $loaderPage.appendTo($newModule);
     $newModule.appendTo($container);

}