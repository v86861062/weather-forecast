import React, { Component } from "react"
import fetchJsonp from "fetch-jsonp"
import "./App.css"

/**
 * https://darksky.net/dev/docs/faq#cross-origin
 * 這裡說 API key 不要放在 clients
 * 但我沒填信用卡資料，所以被盜用也沒損失 :)
 */
const DARK_SKY_API_URL =
  "https://api.darksky.net/forecast/4cb365a801ca5928923efc0e201b8497/"

const LANGUAGE = "zh-tw"

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { status: "" }
  }

  componentWillMount() {
    this.geoFindMe()
  }

  geoFindMe() {
    const success = position => {
      /* 查過的地點，天氣資料會存在 localStorage
       * 距離差不多的地方，不用重查
       * 所以只保留小數點後兩位
       */
      const latitude = position.coords.latitude.toFixed(2)
      const longitude = position.coords.longitude.toFixed(2)

      this.setStatus(`latitude: ${latitude}, longitude: ${longitude}`)

      this.getData(latitude, longitude)
        .then(data => console.log(data)) // JSON from `response.json()` call
        .catch(error => console.error(error))
    }

    const error = () => {
      this.setStatus("Unable to retrieve your location")
    }

    if (!navigator.geolocation) {
      this.setStatus("Geolocation is not supported by your browser")
    } else {
      this.setStatus("Locating…")
      navigator.geolocation.getCurrentPosition(success, error)
    }
  }

  setStatus(str) {
    this.setState({ status: str })
  }

  getData(latitude, longitude) {
    const key = `${latitude}${longitude}`
    const data = JSON.parse(localStorage.getItem(key))

    if (data && this.isCloseToThePresentTime(data)) {
      console.log("use old data")
      return Promise.resolve(data)
    } else {
      /**
       * https://darksky.net/dev/docs/faq#cross-origin
       * Dark Sky API 說不給用 CORS
       * 所以用 Jsonp
       */
      return fetchJsonp(
        `${DARK_SKY_API_URL}${latitude},${longitude}?lang=${LANGUAGE}`
      )
        .then(function(response) {
          return response.json()
        })
        .then(function(myJson) {
          console.log("call api then save new data")
          localStorage.setItem(key, JSON.stringify(myJson))
          console.log(myJson)
        })
    }
  }

  isCloseToThePresentTime(data) {
    const DoNotUpdateTime = 5 * 60

    return this.getNowTimestampInSeconds() - data.currently.time <
      DoNotUpdateTime
      ? true
      : false
  }

  getNowTimestampInSeconds() {
    return Math.floor(Date.now() / 1000)
  }

  render() {
    return (
      <div className="App">
        <p>{this.state.status}</p>
      </div>
    )
  }
}

export default App
