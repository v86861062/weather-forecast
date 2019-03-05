import React from "react"
import PropTypes from "prop-types"
import "tachyons/css/tachyons.min.css"

function Temperature(props) {
  return <div className={props.className}>{props.degree.toFixed(0)}°</div>
}

Temperature.propTypes = {
  degree: PropTypes.number.isRequired,
  className: PropTypes.string
}

export default Temperature
