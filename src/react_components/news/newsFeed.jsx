'use strict'

import React from 'react'
import NewsPost from './newsPost'

class NewsFeed extends React.Component {
  constructor (props, context) {
    super(props)
    if (context.initialDataLoader) {
      context.initialDataLoader.requestData([{
        key: 'news',
        alwaysReload: false,
        url: 'https://graph.facebook.com/wunderundfitzig/feed',
        params: {
          fields: 'message,object_id,created_time,picture,link,type',
          access_token: props.accessToken,
          limit: 10
        }
      }])
    }
  }

  render () {
    if (!this.props.news) return null

    const posts = this.props.news.data.data
    const NewsPosts = posts.map((post, index) => {
      if ((post.type === 'photo' || post.type === 'link') && post.object_id) {
        return (
          <NewsPost
            key = { 'key-' + index }
            id = { post.object_id }
            isFirst = { index === 0 }
            createdTime = { post.created_time }
            link = { post.link }
            type = { post.type }
            picture = { post.picture }
            message = { post.message }
            accessToken = { this.props.accessToken }
          />
        )
      }
    })

    return (
      <ul className='news-feed'>
        <li className='news-post'>{ NewsPosts }</li>
      </ul>
    )
  }
}

NewsFeed.propTypes = {
  news: React.PropTypes.object,
  accessToken: React.PropTypes.string.isRequired
}

NewsFeed.contextTypes = {
  initialDataLoader: React.PropTypes.object
}

export default NewsFeed
