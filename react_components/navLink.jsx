'use strict'

import React from 'react'
import { Link } from 'react-router'

let NavLink = (props) => {
  let { href, ...other } = props
  let isActive = props.currentPath === props.href

  return (
    <Link { ...other } to={ href } className={ isActive ? 'active' : '' }>
      { props.children }
    </Link>
  )
}

export default NavLink
