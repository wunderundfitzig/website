'use strict'

import React from 'react'
import { Link } from 'react-router'

export default (props) => {
  let { href, ...other } = props
  let isActive = props.currentPath === props.href

  return (
    <Link { ...other } to={ href } className={ isActive ? 'active' : '' }>
      { props.children }
    </Link>
  )
}
