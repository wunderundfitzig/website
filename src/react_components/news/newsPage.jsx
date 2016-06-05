'use strict'

import React from 'react'
import NewsFeed from './newsFeed'

let NewsPage = () => (
  <section className='inner-content'>
    <h1 className='neugierig'>neu<strong>gierig</strong>?</h1>
    <div className='contact'>
      <div className='wrapper'>
        <p>
          wunder &amp; fitzig<br/>
          Web &amp; Print
        </p>
        <p>
          <a className='externlink' href='https://goo.gl/maps/VsHnP' target='_blank'>
            Lausitzer Straße 47 <br/>
            10999 Berlin
          </a>
        </p>
        <p>
          030 864 514 59 <br/>
          <a className='email' href='mailto:info@wunderundfitzig.de'>
            info@wunderundfitzig.de
          </a>
        </p>
      </div>
    </div>
    <div id='news-frame' className='news-feed'>
      <NewsFeed accessToken={ NewsPage.accessToken } />
    </div>
    <p className='more-news-link'>
      ältere News sind für alle Ewigkeit auf <a href='http://www.facebook.com/wunderundfitzig' target='_blank'>facebook</a> zu finden
    </p>
    <div className='impressum'>
      <p>
        wunder &amp; fitzig GBR - 2014
      </p>
    </div>
  </section>
)

NewsPage.accessToken = '1406084659649648|WQ4B1azOuVfGMUoUvDrtXsJ27DE'
NewsPage.load = [{
  key: 'news',
  alwaysReload: false,
  url: 'https://graph.facebook.com/wunderundfitzig/feed',
  params: {
    fields: 'message,object_id,created_time,picture,link,type',
    access_token: NewsPage.accessToken,
    limit: 10
  }
}]

export default NewsPage
