import React, { Component } from "react"
import "tachyons/css/tachyons.min.css"
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
      weatherData: null,
      loaded: false,
      address: null,
      error: false,
      errorStr: ""
    }
  }

  componentWillMount() {
    this.getPosition()
      .then(position => {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude

        return Promise.all([
          position,
          this.getWeatherData(latitude, longitude),
          this.getAddress(latitude, longitude)
        ])
      })
      .then(allResult => {
        const weatherData = allResult[1]
        const address = allResult[2]
        this.setState({
          weatherData: { ...weatherData },
          address: `${address.data.city}${address.data.district}`,
          loaded: true
        })
      })
      .catch(error => {
        this.setState({ error: true, errorStr: error.message })
        console.error(error)
      })
  }

  getPosition(options) {
    return new Promise(function(resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject, options)
    })
  }

  getWeatherData(latitude, longitude) {
    const url = `${DARK_SKY_API_URL}${latitude},${longitude}?lang=${LANGUAGE}&units=auto`
    return this.fetchForJSON(proxyurl + url)
  }

  getAddress(latitude, longitude) {
    const url = `https://api.opencube.tw/location?lat=${latitude}&lng=${longitude}`
    return this.fetchForJSON(proxyurl + url)
  }

  fetchForJSON(url) {
    return fetch(url)
      .then(function(response) {
        if (response.status >= 200 && response.status < 300) {
          return response.json()
        } else {
          var error = new Error(
            `${url} ${response.statusText || response.status}`
          )
          error.response = response
          return Promise.reject(error)
        }
      })
      .then(function(myJson) {
        return myJson
      })
  }

  render() {
    const { loaded, weatherData, address, error, errorStr } = this.state

    if (error) {
      return <p>{errorStr}</p>
    }

    let weatherOfTheDays = null
    let currentlyInfo = null
    if (loaded) {
      weatherOfTheDays = weatherData.daily.data.map(d => (
        <WeatherOfTheDay
          key={d.time}
          temperatureMax={d.apparentTemperatureMax}
          temperatureMin={d.apparentTemperatureMin}
          icon={d.icon}
          timestamp={d.time}
        />
      ))

      const time = new Date(weatherData.currently.time * 1000)
      currentlyInfo = `${time.getMonth() + 1}/${time.getDate()}
                        ${time.getHours()}:${time.getMinutes()}
                        ${weatherData.currently.summary}`
    }

    return (
      <div
        className="flex justify-between flex-column 
                   tc purple vh-100 background-image"
      >
        <div className="ma3-ns ma2 f-1-ns f2">
          <div>{address}</div>
          {currentlyInfo}
        </div>

        <div
          className="flex-none-l flex-auto 
                     ba b--gold bw1 overflow-auto carousel-wrap
                     flex flex-row-l flex-column-m flex-column justify-between"
        >
          {weatherOfTheDays}
        </div>

        <Footer />
      </div>
    )
  }
}

export default App
