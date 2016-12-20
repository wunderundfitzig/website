'use strict'

import React, { PropTypes } from 'react'
import fetch from 'node-fetch'
import NewsPost from './newsPost'

class NewsFeed extends React.Component {
  constructor (props, context) {
    super(props)
    if (props.news) return

    context.awaitBeforeServerRender.register({
      promise: fetch(`${process.env.HOST || window.location.origin}/api/newsFeed`)
      .then(res => res.json())
      .then(news => { context.store.setState({ news }) })
    })
  }

  render () {
    if (!this.props.news) return <div className='news-feed-placeholder' />

    return (
      <ul className='news-feed'>
        {this.props.news.map((post, index) => (
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
  news: React.PropTypes.array
}

NewsFeed.contextTypes = {
  awaitBeforeServerRender: PropTypes.object,
  store: PropTypes.func
}

export default NewsFeed
