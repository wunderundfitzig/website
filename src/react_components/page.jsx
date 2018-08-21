/* global alert */
'use strict'

import React, { PropTypes } from 'react'
import { Match, Link } from 'react-router'
import save from './_lib/save'
import PasswordPromt from './_lib/passwordPromt'
import NewsPage from './news/newsPage'
import CreativesPage from './creatives/creativesPage'
import WorkPage from './work/workPage'
import PrivacyPage from './privacy/privacyPage'

class Page extends React.Component {
  constructor (props, context) {
    super(props)
    this.state = context.store()
  }

  saveEdits () {
    if (!this.passwordPromt) return

    this.passwordPromt.requestPassword()
    .then(password => save({
      state: {
        stories: this.state.stories,
        creatives: this.state.creatives,
        privacyInfo: this.state.privacyInfo
      },
      password: password
    }))
    .then(res => {
      if (res.ok) {
        window.location.reload()
      } else {
        if (res.status === 401) {
          alert('falsches Passwort')
        } else {
          console.error(res)
          alert('unbekannter fehler')
        }
      }
    })
    .catch(reason => {
      console.log('save failed:', reason)
    })
  }

  componentDidMount () {
    const store = this.context.store
    this.unsubsribeFromStore = store(state => this.setState(state))
    store.main.checkIfMobile()
    store.main.clientLoaded()
    window.addEventListener('resize', () => { store.main.checkIfMobile() })
    window.addEventListener('keydown', e => {
      // meta + e
      if ((e.metaKey || e.ctrlKey) && e.keyCode === 69) store.main.toggleEditMode()
      // meta + s
      if ((e.metaKey || e.ctrlKey) && e.keyCode === 83) {
        e.preventDefault()
        this.saveEdits()
      }
    })
  }

  render () {
    const {
      main: { editMode, clientLoaded, isMobile },
      creatives,
      news,
      stories,
      privacyInfo
    } = this.state

    return (
      <html lang='de'>
        <head>
          <meta charSet='UTF-8' />
          <meta name='viewport' content={'width=device-width, initial-scale=1.0, ' +
                                         'maximum-scale=1.0, user-scalable=0'} />

          <Match pattern='creatives'
            render={() => <title>wunder & fitzig | creatives</title>} />
          <Match pattern='stories'
            render={() => <title>wunder & fitzig | work</title>} />
          <Match exactly pattern='/'
            render={() => <title>wunder & fitzig</title>} />

          <meta name='description' content={'Wir sind eine Kreativagentur aus Berlin. ' +
                                            'Wir gestalten digitale und analoge ' +
                                            'Nutzererlebnisse.'} />

          <link rel='stylesheet' href='/assets/css/main.css' />
          <script async src='/assets/js/bundle.js' />
          {
            // add data loded on the server so we can can read it and dont have
            // to load it again but only for the first render
            !clientLoaded &&
            <script dangerouslySetInnerHTML={{ __html: 'window.initialData = ' +
                                                        JSON.stringify(this.state) }} />
          }
        </head>

        <body>
          <header className={`blackHeader ${editMode && 'edit-mode'}`}>
            <nav className='topNavigation'>
              <ul>
                <li className='menu-item'>
                  <Link to='/creatives/' activeClassName='active'>
                    <img className='menu-img'
                      src='/assets/img/creatives.svg'
                      alt='creatives' />
                  </Link>
                </li>
                <li className='menu-item'>
                  <Link to='/' activeClassName='active' activeOnlyWhenExact>
                    <img className='menu-logo'
                      src='/assets/img/logo.svg'
                      alt='wunder &amp; fitzig' />
                  </Link>
                </li>
                <li className='menu-item'>
                  <Link to='/work/' activeClassName='active'>
                    <img className='menu-img'
                      src='/assets/img/work.svg'
                      alt='work' />
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
            <Match pattern='/work' render={(matchProps) => (
              <WorkPage {...matchProps}
                isMobile={isMobile}
                editMode={editMode}
                stories={stories}
              />
            )} />
            <Match pattern='/privacy' render={(matchProps) => (
              <PrivacyPage
                editMode={editMode}
                privacyInfo={privacyInfo}
              />
            )} />
          </div>
          <div className='footer'>
            <Link to='/privacy/' activeClassName='active'>
              Datenschutz / Impressum
            </Link>|
            <a href='https://www.facebook.com/wunderundfitzig/' target='_blank'>
              facebook
            </a>|
            <a href='https://github.com/wunderundfitzig' target='_blank'>
              github
            </a>
          </div>
          <PasswordPromt ref={promt => { this.passwordPromt = promt }} />
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
