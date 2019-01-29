class WeatherItem {
     constructor(icon, sunrise, sunset, temp, tempF, minTemp, maxTemp, humidity, windSpeed, cloudCover, visibility, pressure) {
          this.icon = icon,
               this.sunrise = sunrise,
               this.sunset = sunset,
               this.temp = temp,
               this.tempF = tempF,
               this.maxTemp = maxTemp,
               this.minTemp = minTemp,
               this.humidity = humidity,
               this.windSpeed = windSpeed,
               this.cloudCover = cloudCover,
               this.visibility = visibility,
               this.pressure = pressure
     }

     displayVal() {
          console.log(this.icon + '\n',
               'sunrise ' + this.sunrise + '\n',
               'sunset ' + this.sunset + '\n',
               'temp ' + this.temp + '\n',
               'tempF ' + this.tempF + '\n',
               'minTemp ' + this.minTemp + '\n',
               'maxTemp ' + this.maxTemp + '\n',
               'humidity ' + this.humidity + '\n',
               'windSpeed ' + this.windSpeed + '\n',
               'cloudCover ' + this.cloudCover + '\n',
               'visibility ' + this.visibility + '\n',
               'pressure ' + this.pressure)
     }
}

export default WeatherItem;