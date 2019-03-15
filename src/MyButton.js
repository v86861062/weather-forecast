import React from "react"
import PropTypes from "prop-types"

function MyButton({ text, onClick }) {
  return (
    <button
      className="f3-ns f4 mt3 pa2 nowrap pointer grow bg-green br4"
      onClick={onClick}
    >
      {text}
    </button>
  )
}

MyButton.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}

export default MyButton
