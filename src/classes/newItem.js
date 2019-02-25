class WeatherItem {
     constructor(id, icon, timezone, day, time, description, sunrise, sunset, temp, tempF, minTemp, maxTemp, humidity, windSpeed, cloudCover, visibility, pressure, cityName, country, pm1, pm25, pm10, airAdvice, airColor, airLevel, hourly, offset, type) {
          this.id = id,
               this.icon = icon,
               this.timezone = timezone,
               this.day = day,
               this.description = description,
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
               this.pressure = pressure,
               this.cityName = cityName,
               this.country = country,
               this.pm1 = pm1,
               this.pm25 = pm25,
               this.pm10 = pm10,
               this.airAdvice = airAdvice,
               this.airColor = airColor,
               this.airLevel = airLevel,
               this.time = time,
               this.hourly = hourly,
               this.offset = offset,
               this.type = type
     }

     displayVal() {
          console.log(this.icon + '\n',
               'sunrise ' + this.sunrise + '\n',
               'country ' + this.country + '\n',
               'city ' + this.cityName + '\n',
               'sunset ' + this.sunset + '\n',
               'temp ' + this.temp + '\n',
               'tempF ' + this.tempF + '\n',
               'minTemp ' + this.minTemp + '\n',
               'maxTemp ' + this.maxTemp + '\n',
               'humidity ' + this.humidity + '\n',
               'windSpeed ' + this.windSpeed + '\n',
               'cloudCover ' + this.cloudCover + '\n',
               'visibility ' + this.visibility + '\n',
               'pressure ' + this.pressure + '\n',
               'pm1 ' + this.pm1 + '\n',
               'pm25 ' + this.pm25 + '\n',
               'pm10 ' + this.pm10 + '\n',
               'airAdvice ' + this.airAdvice + '\n',
               'airColor ' + this.airColor + '\n',
               'airLevel ' + this.airLevel + '\n'
          )
     }
}

export default WeatherItem;