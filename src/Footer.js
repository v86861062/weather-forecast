import React from "react"

function Link(props) {
  const { className, href, children } = props
  return (
    <a className={`ma2-ns db f6-ns f7 link dim black ${className}`} href={href}>
      {children}
    </a>
  )
}

function Footer() {
  return (
    <footer className="w-100">
      <Link className="fr-ns" href="https://darksky.net/dev">
        Powered by Dark Sky
      </Link>

      <Link
        className="fl-ns"
        href="https://www.pexels.com/photo/landscape-photo-of-mountain-669963/?utm_content=attributionCopyText&utm_medium=referral&utm_source=pexels"
      >
        Photo by Tsang Chung Yee from Pexels
      </Link>
    </footer>
  )
}

export default Footer
