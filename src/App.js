import React, { Component } from "react"
import WeatherOfTheDay from "./WeatherOfTheDay"
import Footer from "./Footer"
import "./App.css"

/* https://darksky.net/dev/docs/faq#cross-origin
 * 這裡說 API key 不要放在 clients
 * 但我沒填信用卡資料，所以被盜用也沒損失 :) */
const DARK_SKY_API_URL =
  "https://api.darksky.net/forecast/4cb365a801ca5928923efc0e201b8497/"

const LANGUAGE = "zh-tw"
const proxyurl = "https://v86861062-cors-anywhere.herokuapp.com/"

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      WeatherData: null,
      loaded: false,
      address: null
    }
  }

  componentWillMount() {
    this.getPosition()
      .then(position => {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude
        this.getWeatherData(latitude, longitude).then(data => {
          this.setState({ WeatherData: { ...data }, loaded: true })
        })

        this.getAddress(latitude, longitude).then(data => {
          this.setState({ address: `${data.data.city}${data.data.district}` })
        })
      })

      .catch(error => console.error(error))
  }

  getPosition(options) {
    return new Promise(function(resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject, options)
    })
  }

  getWeatherData(latitude, longitude) {
    const url = `${DARK_SKY_API_URL}${latitude},${longitude}?lang=${LANGUAGE}`
    return this.fetchForJSON(proxyurl + url)
  }

  getAddress(latitude, longitude) {
    const url = "https://api.opencube.tw/location?lat=24.14&lng=120.65&"
    return this.fetchForJSON(proxyurl + url)
  }

  fetchForJSON(url) {
    return fetch(url)
      .then(function(response) {
        return response.json()
      })
      .then(function(myJson) {
        return myJson
      })
  }

  render() {
    const { loaded, WeatherData, address } = this.state

    let weatherOfTheDays = null
    let currentlyInfo = null
    if (loaded) {
      weatherOfTheDays = WeatherData.daily.data.map(d => (
        <WeatherOfTheDay
          key={d.time}
          temperatureMax={d.apparentTemperatureMax}
          temperatureMin={d.apparentTemperatureMin}
          icon={d.icon}
          timestamp={d.time}
        />
      ))

      const time = new Date(WeatherData.currently.time * 1000)
      currentlyInfo = `${time.getMonth() + 1}/${time.getDate()}
                        ${time.getHours()}:${time.getMinutes()}
                        ${WeatherData.currently.summary}`
    }

    return (
      <div className="App">
        {address}
        {currentlyInfo}
        <p>---------------</p>
        {weatherOfTheDays}
        <Footer />
      </div>
    )
  }
}

export default App
