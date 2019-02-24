import React, { Component } from "react"
import "./App.css"

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

  render() {
    return (
      <div className="App">
        <p>{this.state.status}</p>
      </div>
    )
  }
}

export default App
