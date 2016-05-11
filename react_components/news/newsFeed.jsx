'use strict'

import React from 'react'
import NewsPost from './newsPost'
import store from '../../store'

let NewsFeed = (props) => {
  console.log(store)
  let posts = store.news.data
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
      <h2>News</h2>
      { NewsPosts }
    </span>
  )
}

NewsFeed.propTypes = {
  accessToken: React.PropTypes.string.isRequired
}

export default NewsFeed
