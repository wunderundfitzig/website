'use strict'

import React from 'react'
import NewsFeed from './newsFeed'
import Hero from './Hero'

const NewsPage = ({ news }) => (
  <div id='news-page'>
    <Hero />
    <NewsFeed accessToken='1406084659649648|WQ4B1azOuVfGMUoUvDrtXsJ27DE' news={ news } />
    <div className='impressum'>
      <p>
        wunder &amp; fitzig GBR - 2016
      </p>
    </div>
  </div>
)

export default NewsPage
