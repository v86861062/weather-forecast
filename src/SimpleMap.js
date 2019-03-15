import React, { Component } from "react"
import GoogleMapReact from "google-map-react"
import "tachyons/css/tachyons.min.css"
import MyButton from "./MyButton"

const Taichung = { lat: 24.14, lng: 120.64 }
const GOOGLE_API_KEY = "AIzaSyALfGSxBrhj-gquT6UVYVJJGr0JXBgyFQU" // cspell:disable-line

class SimpleMap extends Component {
  constructor(props) {
    super(props)
    this.state = { markLatLng: { lat: null, lng: null } }
    this.map = null
  }

  static defaultProps = {
    center: {
      ...Taichung
    },
    zoom: 8
  }

  createMapOptions(maps) {
    return {
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: [{ stylers: [{ saturation: -100 }, { gamma: 0.8 }] }]
    }
  }

  apiIsLoaded = (map, maps) => {
    if (!map) return

    this.map = map
  }

  placeMarkerAndPanTo(latLng, map) {
    map.panTo(latLng)
  }

  _handleMapClick = obj => {
    const latLng = { lat: obj.lat, lng: obj.lng }
    const map = this.map

    this.setState({ markLatLng: latLng })
    if (map) map.panTo(latLng)
  }

  _handleButtonClick = event => {
    event.stopPropagation() //這是為了避免 _onMapClick 執行

    const latLng = this.state.markLatLng
    const { onClickCloseBtn } = this.props
    onClickCloseBtn(latLng)
  }

  render() {
    const { lat, lng } = this.state.markLatLng

    return (
      // Important! Always set the container height explicitly
      <div style={{ height: "100%", width: "100%" }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: GOOGLE_API_KEY }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
          options={this.createMapOptions}
          onClick={this._handleMapClick}
          onGoogleApiLoaded={({ map, maps }) => this.apiIsLoaded(map, maps)}
          yesIWantToUseGoogleMapApiInternals
        >
          <MarkWithButton
            lat={lat}
            lng={lng}
            text="我選好了"
            onClick={this._handleButtonClick}
          />
        </GoogleMapReact>
      </div>
    )
  }
}

const MarkWithButton = ({ text, onClick }) => (
  <div className="flex flex-column items-center">
    <div style={greatPlaceStyle} />
    <MyButton className="ma3 f3 f4-ns"  onClick={onClick} >{text}</MyButton>
  </div>
)

const K_WIDTH = 20
const K_HEIGHT = 20
const greatPlaceStyle = {
  // initially any map object has left top corner at lat lng coordinates
  // it's on you to set object origin to 0,0 coordinates
  position: "absolute",
  width: K_WIDTH,
  height: K_HEIGHT,
  left: -K_WIDTH / 2,
  top: -K_HEIGHT / 2,

  border: "5px solid #f44336",
  borderRadius: K_HEIGHT,
  backgroundColor: "white",
  textAlign: "center",
  color: "#3f51b5",
  fontSize: 16,
  fontWeight: "bold",
  padding: 4
}

export default SimpleMap
