import React, { Component } from "react"
import ReactFitText from "react-fittext"
import promiseAny from "promise-any"
import "tachyons/css/tachyons.min.css"
import WeatherOfTheDay from "./WeatherOfTheDay"
import Footer from "./Footer"
import LoaderSpinner from "./LoaderSpinner"
import SimpleMap from "./SimpleMap"
import MyButton from "./MyButton"
import "./App.css"

/* https://darksky.net/dev/docs/faq#cross-origin
 * 這裡說 API key 不要放在 clients
 * 但我沒填信用卡資料，所以被盜用也沒損失 :) */
const DARK_SKY_API_URL =
  "https://api.darksky.net/forecast/4cb365a801ca5928923efc0e201b8497/"

const LANGUAGE = "zh-tw"
const proxies = [
  "https://v86861062-cors-anywhere.herokuapp.com/",
  "https://cors-anywhere.herokuapp.com/"
]

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      weatherData: null,
      loaded: false,
      address: null,
      error: false,
      errorStr: "",
      enableMap: false
    }
  }

  componentWillMount() {
    this.getPosition()
      .then(position => {
        return {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
      })
      .then(latLng => {
        this.getThenUpdateWeatherAndAddress(latLng)
      })
  }

  getThenUpdateWeatherAndAddress = ({ latitude, longitude }) => {
    return Promise.all([
      this.getWeatherData(latitude, longitude),
      this.getAddress(latitude, longitude)
    ])
      .then(allResult => {
        return { weatherData: allResult[0], address: allResult[1] }
      })
      .then(({ weatherData, address }) => {
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
    return this.useProxiesToFetch(url)
  }

  getAddress(latitude, longitude) {
    const url = `https://api.opencube.tw/location?lat=${latitude}&lng=${longitude}`
    return this.useProxiesToFetch(url)
  }

  useProxiesToFetch(url) {
    const promises = proxies.map(v => this.fetchForJSON(v + url))
    return promiseAny(promises).catch(() => {
      throw new Error("Maybe all proxies are dead :(")
    })
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

  _handleEnterLatLng = ({ lat, lng }) => {
    this.setState({ enableMap: false, loaded: false })
    this.getThenUpdateWeatherAndAddress({ latitude: lat, longitude: lng })
  }

  _handleOpenMap = () => {
    this.setState({ enableMap: true })
  }

  render() {
    const {
      loaded,
      weatherData,
      address,
      error,
      errorStr,
      enableMap
    } = this.state

    if (error) {
      return <p>{errorStr}</p>
    }

    if (enableMap) {
      return <SimpleMap onClickCloseBtn={this._handleEnterLatLng} />
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
      currentlyInfo = `${address}\n${time.getMonth() +
        1}/${time.getDate()}   ${time.getHours()}:${time.getMinutes()}\n${
        weatherData.currently.summary
      }`
    }

    return (
      <div
        className="app flex flex-column justify-between items-center fixed
                   tc purple h-100 w-100 background-image sans-serif"
      >
        <LoaderSpinner loaded={loaded}>
          <ReactFitText>
            <div
              className="ma3-ns ma2 w-50
                         pre overflow-hidden flex-minimum-content-sizing"
            >
              {currentlyInfo}
            </div>
          </ReactFitText>
          <MyButton text={"我要選地點"} onClick={this._handleOpenMap} />
        </LoaderSpinner>
        <LoaderSpinner loaded={loaded}>
          <ReactFitText>
            <div
              className="flex-none-l flex-auto 
                       ba b--gold bw1 overflow-auto carousel-wrap w-100
                       flex flex-row-l flex-column-m flex-column justify-between"
            >
              {weatherOfTheDays}
            </div>
          </ReactFitText>
        </LoaderSpinner>
        <Footer />
      </div>
    )
  }
}

export default App
