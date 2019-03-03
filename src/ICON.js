import React from "react"
import PropTypes from "prop-types"
import "./ICON.css"

const ICON_TABLE = {
  "clear-day": "icon-sun",
  "clear-night": "icon-moon",
  rain: "icon-rainy",
  snow: "icon-snowy",
  sleet: "icon-weather",
  wind: "icon-wind",
  fog: "icon-weather1",
  cloudy: "icon-cloudy1",
  "partly-cloudy-day": "icon-cloudy",
  "partly-cloudy-night": "icon-cloud"
}

function ICON(props) {
  const iconClass = ICON_TABLE[props.icon] || ""
  return <div className={iconClass} />
}

ICON.propTypes = {
  icon: PropTypes.string.isRequired
}

export default ICON
