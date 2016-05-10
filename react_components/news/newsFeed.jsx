'use strict'

import React from 'react'
import request from 'superagent'

import NewsPost from './newsPost'

export default class NewsFeed extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      posts: [],
      loadingState: 'loading'
    }
  }

  componentDidMount () {
    // get news feed from facebook
    request.get(this.props.url)
      .query({
        fields: this.props.fields,
        access_token: this.props.accessToken,
        limit: this.props.limit
      })
      .end((err, res) => {
        if (err) return console.error(err)
        this.setState({
          posts: res.body.data,
          loadingState: 'load-' + res.status
        })
      })
  }

  render () {
    var NewsPosts = this.state.posts.map((post, index) => {
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
            accessToken = { this.props.accessToken }
          />
        )
      }
    })

    return (
      <span>
        <h2 className = { this.state.loadingState }>News</h2>
        { NewsPosts }
      </span>
    )
  }
}

NewsFeed.propTypes = {
  url: React.PropTypes.string.isRequired,
  fields: React.PropTypes.string.isRequired,
  accessToken: React.PropTypes.string.isRequired,
  limit: React.PropTypes.number.isRequired
}
