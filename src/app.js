import $ from "jquery";
import Weather from "./classes/Weather";
import GeoLocation from "./classes/GeoLocation";


// SCSS
import "./styles/main.scss";


let weather = new GeoLocation('Wroclaw');
let weather_city = new Weather(51.1000000 , 17.0333300);

console.log(weather.getDate());
console.log(weather_city.getDate());

