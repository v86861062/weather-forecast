import React from "react"
import PropTypes from "prop-types"
import ICON from "./ICON"
import Temperature from "./Temperature"

function WeatherOfTheDay(props) {
  const { temperatureMax, temperatureMin, icon, timestamp } = props
  let day = new Date(timestamp * 1000)
  return (
    <div>
      {day.getMonth() + 1}/{day.getDate()}
      <ICON icon={icon} />
      <Temperature degree={temperatureMax} />
      <Temperature degree={temperatureMin} />
      <p>---------</p>
    </div>
  )
}

WeatherOfTheDay.propTypes = {
  temperatureMax: PropTypes.number.isRequired,
  temperatureMin: PropTypes.number.isRequired,
  icon: PropTypes.string.isRequired,
  timestamp: PropTypes.number.isRequired
}

export default WeatherOfTheDay
