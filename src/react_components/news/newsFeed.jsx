'use strict'

import React, { PropTypes } from 'react'
import fetch from 'node-fetch'
import NewsPost from './newsPost'

class NewsFeed extends React.Component {
  constructor (props, context) {
    super(props)
    if (props.news.length > 0) return

    context.awaitBeforeServerRender.register({
      promise: fetch(`${process.env.HOST || window.location.origin}/api/newsFeed`)
      .then(res => res.json())
      .then(news => { context.store.news.add(news) })
    })
  }

  render () {
    const { news } = this.props
    if (news.length === 0) return <div id='news-feed' className='news-feed-placeholder' />

    return (
      <ul id='news-feed'>
        {news.map((post, index) => (
          <li key={'key-' + index}>
            <NewsPost
              isFirst={index === 0}
              createdTime={post.created_time}
              link={post.link}
              picture={post.picture}
              message={post.message}
            />
          </li>
        ))}
      </ul>
    )
  }
}

NewsFeed.propTypes = {
  news: React.PropTypes.array.isRequired
}

NewsFeed.contextTypes = {
  awaitBeforeServerRender: PropTypes.object,
  store: PropTypes.func
}

export default NewsFeed
