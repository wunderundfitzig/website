'use strict'

import React, { PropTypes } from 'react'
import fetch from 'node-fetch'
import NewsPost from './newsPost'

class NewsFeed extends React.Component {
  constructor (props, context) {
    super(props)
    if (props.news) return

    const fields = 'message,object_id,created_time,picture,link,type'
    context.awaitBeforeServerRender.register({
      promise: fetch(`https://graph.facebook.com/wunderundfitzig/feed?fields=${fields}&access_token=${props.accessToken}&limit=10`)
      .then(res => res.json())
      .then(news => { context.store.setState({ news: news.data }) })
      .catch(() => {
        console.error('could not load news')
        context.store.setState({ news: null })
      })
    })
  }

  render () {
    if (!this.props.news) return <div className='news-feed-placeholder' />

    return (
      <ul className='news-feed'>
        {this.props.news.filter(post => (
          (post.type === 'photo' || post.type === 'link') && post.object_id)
        ).map((post, index) => (
          <li key={'key-' + index}>
            <NewsPost
              id={post.object_id}
              isFirst={index === 0}
              createdTime={post.created_time}
              link={post.link}
              type={post.type}
              picture={post.picture}
              message={post.message}
              accessToken={this.props.accessToken}
            />
          </li>
        ))}
      </ul>
    )
  }
}

NewsFeed.propTypes = {
  news: React.PropTypes.array,
  accessToken: React.PropTypes.string.isRequired
}

NewsFeed.contextTypes = {
  awaitBeforeServerRender: PropTypes.object,
  store: PropTypes.func
}

export default NewsFeed
