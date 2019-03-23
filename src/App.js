import React, { Component } from "react"
import ReactFitText from "react-fittext"
import promiseAny from "promise-any"
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
    this._getPosition()
      .then(position => {
        return {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
      })
      .then(latLng => {
        this._getThenUpdateWeatherAndAddress(latLng)
      })
  }

  _getThenUpdateWeatherAndAddress = latLng => {
    return Promise.all([this._getWeatherData(latLng), this._getAddress(latLng)])
      .then(allResult => {
        return { weatherData: allResult[0], address: allResult[1] }
      })
      .then(({ weatherData, address }) => {
        this.setState({
          weatherData: { ...weatherData },
          address: this._getUsefulAddress(address),
          loaded: true
        })
      })
      .catch(error => {
        this.setState({ error: true, errorStr: error.message })
        console.error(error)
      })
  }

  /* 海上、荒郊野外，沒路的地方沒地址，只好特別處理 :( */
  _getUsefulAddress(address) {
    const { country_name, city, district, full_address } = address.data

    if (city && district) {
      return city + district
    } else if (country_name && (city || district)) {
      return `${country_name}${city || ""}${district || ""}`
    } else if (full_address) {
      return full_address
    } else {
      return "這裡沒地址 :("
    }
  }

  _getPosition(options) {
    return new Promise(function(resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject, options)
    })
  }

  _getWeatherData({ lat, lng }) {
    const url = `${DARK_SKY_API_URL}${lat},${lng}?lang=${LANGUAGE}&units=auto`
    return this._useProxiesToFetch(url)
  }

  _getAddress({ lat, lng }) {
    const url = `https://api.opencube.tw/location?lat=${lat}&lng=${lng}`
    return this._useProxiesToFetch(url)
  }

  _useProxiesToFetch(url) {
    const promises = proxies.map(v => this._fetchForJSON(v + url))
    return promiseAny(promises).catch(() => {
      throw new Error("Maybe all proxies are dead :(")
    })
  }

  _fetchForJSON(url) {
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

  _handleEnterLatLng = latLng => {
    this.setState({ enableMap: false, loaded: false })
    this._getThenUpdateWeatherAndAddress(latLng)
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
        className="flex flex-column justify-between items-center fixed
                   tc purple h-100 w-100 background-image"
      >
        <LoaderSpinner className="w-50" loaded={loaded}>
          <ReactFitText compressor={1.5}>
            <div
              className="ma3-ns ma2 w-100
                            pre overflow-hidden flex-minimum-content-sizing"
            >
              {currentlyInfo}
            </div>
          </ReactFitText>

          <MyButton className="w-30-ns w-auto" onClick={this._handleOpenMap}>
            <ReactFitText>
              <div>{"我要選地點"}</div>
            </ReactFitText>
          </MyButton>

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
