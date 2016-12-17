'use strict'

import React from 'react'
import NewsFeed from './newsFeed'
import Hero from './Hero'

const NewsPage = ({ news }) => (
  <div id='news-page'>
    <div className='inner-content'>
      <Hero />
      <NewsFeed accessToken='1406084659649648|WQ4B1azOuVfGMUoUvDrtXsJ27DE' news={news} />
    </div>
    <div className='footer'>
      <a href='https://www.facebook.com/wunderundfitzig/' target='_blank' >facebook</a>|
      <a href='https://www.instagram.com/wunderundfitzig/' target='_blank' >instagram</a>|
      <a href='https://github.com/wunderundfitzig' target='_blank' >github</a>
    </div>
  </div>
)

export default NewsPage
