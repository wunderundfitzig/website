'use strict'

import React from 'react'
// react componets
import NavLink from './navLink'

export default class Page extends React.Component {
  getTitleString () {
    switch (this.props.route.path) {
      case '/creatives/':
        return 'Creatives'
      case '/stories/':
        return 'Stories'
      default:
        return 'Werbeagentur Berlin'
    }
  }

  render () {
    return (
      <html lang = 'de'>
        <head>
            <meta charSet = 'UTF-8' />
            <meta
              name = 'viewport'
              content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'
            />
            <title>{ 'wunder & fitzig | ' + this.getTitleString() }</title>
            <link rel = 'stylesheet' href = '/assets/css/main.css' />
            <script src = '/assets/js/client.js' />
        </head>

        <body>
          <header className = 'blackHeader'>
            <nav className = 'topNavigation'>
              <ul>
                <li className = 'menu-item'>
                  <NavLink
                    href = '/creatives/'
                    currentPath = { this.props.route.path }
                  >
                    <img
                      className = 'menu-img'
                      src = '/assets/img/creatives.svg'
                      alt = 'creatives'
                    />
                  </NavLink>
                </li>
                <li className = 'menu-item'>
                  <NavLink href = '/' currentPath = { this.props.route.path }>
                    <img
                      className = 'menu-logo'
                      src = '/assets/img/logo.svg'
                      alt = 'wunder &amp; fitzig'
                    />
                  </NavLink>
                </li>
                <li className = 'menu-item'>
                  <NavLink href = '/stories/' currentPath = { this.props.route.path }>
                    <img
                      className = 'menu-img'
                      src = '/assets/img/stories.svg'
                      alt = 'stories'
                    />
                  </NavLink>
                </li>
              </ul>
            </nav>
          </header>

          <div className = 'content'>
            {this.props.children}
          </div>
        </body>
      </html>
    )
  }
}
