import React from "react"
import PropTypes from "prop-types"
import "tachyons/css/tachyons.min.css"
import ICON from "./ICON"
import Temperature from "./Temperature"

function WeatherOfTheDay(props) {
  const { temperatureMax, temperatureMin, icon, timestamp } = props
  let day = new Date(timestamp * 1000)
  return (
    <div
      className="flex-minimum-content-sizing
                 flex flex-column-l flex-row-m flex-row 
                 justify-around items-center
                 ba b--light-silver bw1 f2-ns f4"
    >
      <div className="ma2">
        {day.getMonth() + 1}/{day.getDate()}
      </div>
      <div className="f-headline-l f-1-m f2 ma1">
        <ICON icon={icon} />
      </div>
      <div className="flex">
        <Temperature className="ma2" degree={temperatureMax} />
        <Temperature className="ma2" degree={temperatureMin} />
      </div>
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
