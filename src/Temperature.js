import React from "react"
import PropTypes from "prop-types"

function Temperature(props) {
  return <div className={props.className}>{props.degree.toFixed(0)}°</div>
}

Temperature.propTypes = {
  degree: PropTypes.number.isRequired,
  className: PropTypes.string
}

export default Temperature
