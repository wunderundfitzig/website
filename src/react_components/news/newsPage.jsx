'use strict'

import React from 'react'
import NewsFeed from './newsFeed'
import Hero from './Hero'

const NewsPage = ({ news }) => (
  <div id='news-page'>
    <div className='inner-content'>
      <Hero />
      <NewsFeed news={news} />
    </div>
  </div>
)

export default NewsPage
