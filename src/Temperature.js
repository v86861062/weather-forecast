import React from "react"
import PropTypes from "prop-types"

function Temperature(props) {
  return <div>{props.degree.toFixed(0)}°</div>
}

Temperature.propTypes = {
  degree: PropTypes.number.isRequired
}

export default Temperature
