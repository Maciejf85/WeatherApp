import $ from "jquery";
class Airly {
     constructor(lat, lng) {
          this.lat = lat,
               this.lng = lng,
               this.apikey = 'dQnvbbAkXgIFwVA3eGBQNCAQMQdiLWLk',
               // this.apiURL = 'https://cors-anywhere.herokuapp.com/https://airapi.airly.eu/v2/measurements/nearest?',
               this.apiURL = 'https://airapi.airly.eu/v2/measurements/nearest?',
               this.maxDistance = 20
     }
     getAirlyData(fn) {
          $.ajax({
               url: `${this.apiURL}apikey=${this.apikey}&Accept=application/json&lat=${this.lat}&lng=${this.lng}&maxDistanceKM=${this.maxDistance}`
          }).done(function (response) {
               fn(response);
          }).fail(function (error) {
               fn(error);
          })
     }
}

export default Airly;