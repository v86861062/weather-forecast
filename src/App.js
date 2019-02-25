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
      const latitude = position.coords.latitude
      const longitude = position.coords.longitude

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
    /**
     * https://darksky.net/dev/docs/faq#cross-origin
     * Dark Sky API 說不給用 CORS
     * 所以用 Jsonp
     */
    return fetchJsonp(`${DARK_SKY_API_URL}${latitude},${longitude}`)
      .then(function(response) {
        return response.json()
      })
      .then(function(myJson) {
        console.log(myJson)
      })
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
