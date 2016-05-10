'use strict'

import React from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import Page from './react_components/page'
// import Stories from './react_components/stories/storiesContainer'
import Creatives from './react_components/creatives/creativesPage'
import NewsPage from './react_components/news/newsPage'

export default (
  <Router className='App' history={ browserHistory } >
    <Route path='/' component={ Page } >
      <IndexRoute component={ NewsPage } />
      <Route path='creatives' component={ Creatives } />
    </Route>
  </Router>
)
