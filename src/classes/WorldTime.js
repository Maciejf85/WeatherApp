import $ from "jquery";

class WorldTime {
     constructor(timeZone) {
          this.timeZone = timeZone,
               this.apiUrl = 'https://cors-anywhere.herokuapp.com/http://worldtimeapi.org/api/timezone/'
               // this.apiUrl = 'http://worldtimeapi.org/api/timezone/'
     }
     getTime(fn) {
          $.ajax({
               url: `${this.apiUrl}${this.timeZone}`
          }).done((response) => {
               fn(response)
          })
     }
}

export default WorldTime;