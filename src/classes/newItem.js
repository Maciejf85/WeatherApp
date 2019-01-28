class WeatherItem {
     constructor(icon, temp, tempF, cloud, visibility, pressure) {
          this.icon = icon,
               this.temp = temp,
               this.tempF = tempF,
               this.cloud = cloud,
               this.visibility = visibility,
               this.pressure = pressure
     }
     displayVal() {
          console.log(this.icon);
          console.log(this.temp);
          console.log(this.tempF);
          console.log(this.cloud);
          console.log(this.visibility);
          console.log(this.pressure);
     }
}

export default WeatherItem;