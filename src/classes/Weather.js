import $ from "jquery";


class Weather {
    constructor(lat, long, country, cityName, type) {
        this.lat = lat,
            this.long = long,
            this.country = country,
            this.cityName = cityName,
            this.type = type,
            this.api = 'https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/',
            this.key = 'ff1f8709e1512d132ab0aa87b7bd9258'
    }

    getWeatherDate(fn) {
        $.ajax({
            url: `${this.api}/${this.key}/${this.lat},${this.long}?lang=pl&units=si`
        }).done((response) => {
            fn(response, this.lat, this.long, this.country, this.cityName, this.type);
        })
    }
}

export default Weather;