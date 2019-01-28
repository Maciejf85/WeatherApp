import $ from "jquery";

class Weather {
    constructor(long, lat) {
        this.long = long,
            this.lat = lat,
            this.api = 'https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/',
            this.key = 'ff1f8709e1512d132ab0aa87b7bd9258'
    }

    getWeatherDate(fn) {
        $.ajax({
            url: `${this.api}/${this.key}/${this.long},${this.lat}?lang=pl&units=si`
        }).done(function (item) {
            console.log(item)
            fn(item);
        })
    }

}

export default Weather;