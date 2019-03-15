import React from "react"
import PropTypes from "prop-types"

function MyButton({ className = "", children, onClick }) {
  return (
    <button
      className={`nowrap pointer grow bg-green br4 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

MyButton.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default MyButton
