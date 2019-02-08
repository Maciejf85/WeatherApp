import $ from "jquery";


class Weather {
    constructor(lat, long, country, cityName, type) {
        this.lat = lat,
            this.long = long,
            this.country = country,
            this.cityName = cityName,
            this.type = type,
            this.api = 'https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/',
            // this.api = 'https://api.darksky.net/forecast/',
            this.key = 'f14d8b5ba08eb7828c4a50aa0869d736'
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