'use strict'

import React from 'react'
import NavLink from './navLink'
import store from '../store'

let Page = (props) => (
  <html lang='de'>
    <head>
        <meta charSet='UTF-8'/>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'
        />
        <title>{ 'wunder & fitzig | ' }</title>
        <link rel='stylesheet' href='/assets/css/main.css'/>
        <script src='/assets/js/bundle.js'/>
        <script dangerouslySetInnerHTML={{ __html: 'window.news = ' + JSON.stringify(store.news) }} />
    </head>

    <body>
      <header className='blackHeader'>
        <nav className='topNavigation'>
          <ul>
            <li className='menu-item'>
              <NavLink href='/creatives/' currentPath={ props.route.path }>
                <img className='menu-img' src='/assets/img/creatives.svg' alt='creatives'/>
              </NavLink>
            </li>
            <li className='menu-item'>
              <NavLink href='/' currentPath={ props.route.path }>
                <img className='menu-logo' src='/assets/img/logo.svg' alt='wunder &amp; fitzig'/>
              </NavLink>
            </li>
            <li className='menu-item'>
              <NavLink href='/stories/' currentPath={ props.route.path }>
                <img className='menu-img' src='/assets/img/stories.svg' alt='stories'/>
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>

      <div className='content'>{ props.children }</div>
    </body>
  </html>
)

export default Page
