import React from "react"
import PropTypes from "prop-types"
import ReactFitText from "react-fittext"
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
                 ba b--light-silver bw1 w-20-l"
    >
      <ReactFitText compressor={0.5}>
        <div className="ma2 w-100">
          {day.getMonth() + 1}/{day.getDate()}
        </div>
      </ReactFitText>

      <ReactFitText compressor={0.3}>
        <div className="ma1 w-100">
          <ICON icon={icon} />
        </div>
      </ReactFitText>

      <ReactFitText compressor={0.5}>
        <div className="flex justify-center w-100">
          <Temperature className="ma2" degree={temperatureMax} />
          <Temperature className="ma2" degree={temperatureMin} />
        </div>
      </ReactFitText>
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
