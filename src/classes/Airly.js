import $ from "jquery";
class Airly {
     constructor(lat, lng) {
          this.lat = lat,
               this.lng = lng,
               this.apikey = 'dQnvbbAkXgIFwVA3eGBQNCAQMQdiLWLk',
               this.apiURL = 'https://airapi.airly.eu/v2/measurements/nearest?',
               this.maxDistance = 5
     }
     getAirlyData() {
          $.ajax({
               url: `${this.apiURL}apikey=${this.apikey}&Accept=application/json&lat=${this.lat}&lng=${this.lng}&maxDistanceKM=${this.maxDistance}`
          }).done(function (response) {
               console.log(response.current.values[0].name)
               console.log(response.current.values[0].value)
               console.log(response.current.values[1].name)
               console.log(response.current.values[1].value)
               console.log(response.current.values[2].name)
               console.log(response.current.values[2].value)
          }).fail(function (error) {
               console.log(error.status)
          })
     }
}


export default Airly;