import $ from 'jquery'
class MyLocation {
     constructor() {
          this.api = 'https://cors-anywhere.herokuapp.com/http://ip-api.com/json/?fields=mobile,country,city,lat,lon'
          // this.api = 'http://ip-api.com/json/?fields=mobile,country,city,lat,lon'
     }

     getMyLocation(fn) {
          $.ajax({
               url: this.api
          }).done((response) => {
               fn(response)
          }).fail(function (error) {
               console.log(error)
          })
     }
}

export default MyLocation;

// https://cors-anywhere.herokuapp.com/