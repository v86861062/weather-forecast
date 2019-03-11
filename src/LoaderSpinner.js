import React from "react"
import PropTypes from "prop-types"
import Loader from "react-loader-spinner"

function LoaderSpinner(props) {
  const { loaded, children } = props

  if (loaded) return children
  else return <Loader type="Puff" color="#00BFFF" height="100" width="100" />
}

LoaderSpinner.propTypes = {
  loaded: PropTypes.bool.isRequired
}

export default LoaderSpinner
