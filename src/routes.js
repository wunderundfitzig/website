'use strict'

import React from 'react'
import { Route, IndexRoute } from 'react-router'
import Page from './react_components/page'
import Stories from './react_components/stories/storiesContainer'
import Creatives from './react_components/creatives/creativesPage'
import NewsPage from './react_components/news/newsPage'

export default (
    <Route path='/' component={ Page } >
      <IndexRoute component={ NewsPage } />
      <Route path='creatives' component={ Creatives } />
      <Route path='stories' component={ Stories } />
    </Route>
)
