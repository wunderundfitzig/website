'use strict'

import React from 'react'
import { Match, Link } from 'react-router'
import NewsPage from './news/newsPage'
import CreativesPage from './creatives/creativesPage'
const MOBILE_WIDTH = 700

class Page extends React.Component {
  constructor (props) {
    super(props)
    this.state = props.initialData || {}
  }

  checkIfMobile () {
    this.setState({ isMobile: window.innerWidth <= MOBILE_WIDTH })
  }

  componentDidMount () {
    this.checkIfMobile()
    window.addEventListener('resize', this.checkIfMobile.bind(this))
  }

  componentDidUpdate (prevProps) {
    if (prevProps.location.key === this.props.location.key) return

    this.context.initialDataLoader.loadRequestedData(this.state)
    .then((initialData) => {
      this.setState({ ...this.state, ...initialData }) // eslint-disable-line
    })
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.checkIfMobile)
  }

  getTitleString (pathname) {
    // trim trailing slashes
    const path = this.props.location.pathname.replace(/\/$/, '')
    const titles = {
      '': '',
      '/creatives': '| creatives',
      '/stories': '| stories'
    }

    return `wunder & fitzig ${ titles[path] }`
  }

  render () {
    const news = this.state.news ? this.state.news.data : null
    const creatives = this.state.creatives ? this.state.creatives.data : null

    return (
      <html lang='de'>
      <head>
          <meta charSet='UTF-8'/>
          <meta name='viewport'
            content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'
          />
          <title>{ this.getTitleString() }</title>
          <link rel='stylesheet' href='/assets/css/main.css'/>
          <script src='/assets/js/bundle.js'/>
          <script dangerouslySetInnerHTML={{ __html: 'window.initialData = ' + JSON.stringify(this.state) }} />
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
                <Link to='/' activeClassName='active' activeOnlyWhenExact>
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

        <div className='content'>
          <Match exactly pattern='/' render={ (matchProps) => (
            <NewsPage {...matchProps} news={ news } />
          )}/>
          <Match pattern='creatives' render={ (matchProps) => (
            <CreativesPage {...matchProps}
              isMobile={ this.state.isMobile }
              sections={ creatives }
            />
          )}/>
        </div>
      </body>
      </html>
    )
  }
}

Page.propTypes = {
  location: React.PropTypes.object.isRequired,
  initialData: React.PropTypes.object
}
Page.contextTypes = {
  initialDataLoader: React.PropTypes.object
}

const PageWrapper = ({ initialData }) => (
  <Match pattern='/' render={ ({ location }) => (
    <Page location={ location } initialData={ initialData } />
  ) } />
)

export default PageWrapper
