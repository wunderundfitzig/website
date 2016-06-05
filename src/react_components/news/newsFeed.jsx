'use strict'

import React from 'react'
import NewsPost from './newsPost'
import store from '../../store'

let NewsFeed = (props) => {
  let posts = store.news.data.data
  let NewsPosts = posts.map((post, index) => {
    if (post.type === 'photo' || post.type === 'link') {
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
          accessToken = { props.accessToken }
        />
      )
    }
  })

  return (
    <span>
      <h2>recent work:</h2>
      { NewsPosts }
    </span>
  )
}

NewsFeed.propTypes = {
  accessToken: React.PropTypes.string.isRequired
}

export default NewsFeed
