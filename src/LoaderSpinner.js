import React from "react"
import PropTypes from "prop-types"
import Loader from "react-loader-spinner"

function LoaderSpinner({ loaded, children, className }) {
  if (loaded) return children
  else
    return (
      <div className={className}>
        <Loader type="Puff" color="#00BFFF" height="100%" width="100%" />
      </div>
    )
}

LoaderSpinner.propTypes = {
  loaded: PropTypes.bool.isRequired
}

export default LoaderSpinner
