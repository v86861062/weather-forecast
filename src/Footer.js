import React from "react"
import "tachyons/css/tachyons.min.css"

function Footer() {
  return (
    <footer>
      <a className="fr ma2 db f6 link dim black" href="https://darksky.net/dev">
        Powered by Dark Sky
      </a>

      <a
        className="fl ma2 db f6 link dim black"
        href="https://www.pexels.com/photo/landscape-photo-of-mountain-669963/?utm_content=attributionCopyText&utm_medium=referral&utm_source=pexels"
      >
        Photo by Tsang Chung Yee from Pexels
      </a>
    </footer>
  )
}

export default Footer
