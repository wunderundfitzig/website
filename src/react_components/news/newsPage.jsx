'use strict'

import React from 'react'
import NewsFeed from './newsFeed'
import Hero from './Hero'

const NewsPage = ({ news }) => (
  <section className='inner-content'>
    <Hero />

    <div id='news-frame'>
      <NewsFeed accessToken='1406084659649648|WQ4B1azOuVfGMUoUvDrtXsJ27DE' news={ news } />
    </div>
    <p className='more-news-link'>
      ältere News sind für alle Ewigkeit auf <a href='http://www.facebook.com/wunderundfitzig' target='_blank'>facebook</a> zu finden
    </p>
    <div className='impressum'>
      <p>
        wunder &amp; fitzig GBR - 2016
      </p>
    </div>
  </section>
)

export default NewsPage
