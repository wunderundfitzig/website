'use strict'

import React, { PropTypes } from 'react'
import { Match, Link } from 'react-router'
import NewsPage from './news/newsPage'
import CreativesPage from './creatives/creativesPage'
import StoriesPage from './stories/storiesPage'

class Page extends React.Component {
  constructor (props, context) {
    super(props)
    this.state = context.store()
  }

  componentDidMount () {
    const store = this.context.store
    this.unsubsribeFromStore = store(state => this.setState(state))
    store.main.checkIfMobile()
    store.main.clientLoaded()
    window.addEventListener('resize', () => { store.main.checkIfMobile() })
    window.addEventListener('keydown', e => {
      if (e.metaKey && e.keyCode === 69) store.main.toggleEditMode()
    })
  }

  componentWillUnmount () {
    this.unsubsribeFromStore()
    window.removeEventListener('resize', this.checkIfMobile)
  }

  render () {
    const { main: { editMode, clientLoaded, isMobile }, creatives, news, stories } = this.state
    return (
      <html lang='de'>
        <head>
          <meta charSet='UTF-8' />
          <meta name='viewport'
            content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'
          />
          <Match pattern='creatives' render={() => <title>wunder & fitzig | creatives</title>} />
          <Match pattern='stories' render={() => <title>wunder & fitzig | stories</title>} />
          <Match exactly pattern='/' render={() => <title>wunder & fitzig</title>} />
          <link rel='stylesheet' href='/assets/css/main.css' />
          <script async src='/assets/js/bundle.js' />
          { /* add data loded on the server so we can can read it and dont have
            to load it again but only for the first render */ }
          { !clientLoaded &&
            <script dangerouslySetInnerHTML={{ __html: 'window.initialData = ' + JSON.stringify(this.state) }} />
          }
        </head>

        <body>
          <header className={`blackHeader ${editMode && 'edit-mode'}`}>
            <nav className='topNavigation'>
              <ul>
                <li className='menu-item'>
                  <Link to='/creatives/' activeClassName='active'>
                    <img className='menu-img' src='/assets/img/creatives.svg' alt='creatives' />
                  </Link>
                </li>
                <li className='menu-item'>
                  <Link to='/' activeClassName='active' activeOnlyWhenExact>
                    <img className='menu-logo' src='/assets/img/logo.svg' alt='wunder &amp; fitzig' />
                  </Link>
                </li>
                <li className='menu-item'>
                  <Link to='/stories/' activeClassName='active'>
                    <img className='menu-img' src='/assets/img/stories.svg' alt='stories' />
                  </Link>
                </li>
              </ul>
            </nav>
          </header>

          <div className='content'>
            <Match exactly pattern='/' render={(matchProps) => (
              <NewsPage {...matchProps} news={news} />
            )} />
            <Match pattern='/creatives' render={(matchProps) => (
              <CreativesPage {...matchProps}
                isMobile={isMobile}
                editMode={editMode}
                creatives={creatives}
              />
            )} />
            <Match pattern='/stories' render={(matchProps) => (
              <StoriesPage {...matchProps}
                isMobile={isMobile}
                editMode={editMode}
                stories={stories}
              />
            )} />
          </div>
        </body>
      </html>
    )
  }
}

Page.contextTypes = {
  initialDataLoader: React.PropTypes.object
}
Page.contextTypes = {
  store: PropTypes.func.isRequired
}

export default Page
