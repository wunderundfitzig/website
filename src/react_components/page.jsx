'use strict'

import React from 'react'
import { Link } from 'react-router'
import { routeTitles } from '../routes'
import store from '../store'

let Page = (props) => (
  <html lang='de'>
    <head>
        <meta charSet='UTF-8'/>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'
        />
        <title>{ `wunder & fitzig | ${ routeTitles[props.location.pathname] }` }</title>
        <link rel='stylesheet' href='/assets/css/main.css'/>
        <script src='/assets/js/bundle.js'/>
        <script dangerouslySetInnerHTML={{ __html: 'window.news = ' + JSON.stringify(store.news) }} />
    </head>

    <body>
      <header className='blackHeader'>
        <nav className='topNavigation'>
          <ul>
            <li className='menu-item'>
              <Link to='/creatives/' activeClassName='active'>
                <img className='menu-img' src='/assets/img/creatives.svg' alt='creatives'/>
              </Link>
            </li>
            <li className='menu-item'>
              <Link to='/' activeClassName='active' onlyActiveOnIndex={ true }>
                <img className='menu-logo' src='/assets/img/logo.svg' alt='wunder &amp; fitzig'/>
              </Link>
            </li>
            <li className='menu-item'>
              <Link to='/stories/' activeClassName='active'>
                <img className='menu-img' src='/assets/img/stories.svg' alt='stories'/>
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <div className='content'>{ props.children }</div>
    </body>
  </html>
)

export default Page