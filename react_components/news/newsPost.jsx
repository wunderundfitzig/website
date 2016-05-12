'use strict'

import React from 'react'
import fetch from 'node-fetch'

export default class NewsPost extends React.Component {
  constructor (props) {
    super(props)
    this.state = { picture: this.props.picture }
  }

  /**
  * format facebook date String to a nice german date
  * @param createdTime {string} an ISO-8601 formatted date/time
  * @return {string} format: DD. Month abbreviation YYYY
  */
  formatDate (createdTime) {
    var date = createdTime.split('T')
    date = date[0].split('-')

    var day = date[2]
    var month = date[1] - 1
    var year = date[0]

    var months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    return day + '. ' + months[month] + ' ' + year
  }

  /**
  * format linebreaks and links as html
  * @param message {string}
  * @return {string}
  */
  formatAsHtml (message) {
    if (message) {
      var str = message.replace(/((http|https|ftp):\/\/[\w?=&.\/-;#~%-]+(?![\w\s?&.\/;#~%"=-]*>))/g, '<a href="$1" target="_blank">$1</a>')
      return str.replace(/(\r\n)|(\n\r)|\r|\n/g, '<br>')
    }
  }

  componentDidMount () {
    if (this.props.type !== 'photo') return
    // replace low res images with large ones
    let fetchBigImg = fetch(`https://graph.facebook.com/${ this.props.id }?fields=images&access_token=${ this.props.accessToken }`)
      .then(res => res.json().then(json => json.images[0].source)) // images[0] should be the largest one
      .catch(err => console.error(err))

    fetchBigImg.then(bigImg => this.setState({ picture: bigImg }))
  }

  render () {
    return (
      <div className={ 'fb-post ' + this.props.type }>
        { /* first element does not show the date */ }
        { this.props.isFirst ? '' : <p className='fb-date'> { this.formatDate(this.props.createdTime) } </p> }
        <a href={ this.props.link } target='_blank' className='fb-link'>
          <img className='fb-picture' src={ this.state.picture } />
        </a>
        <p className='fb-message' dangerouslySetInnerHTML={{ __html: this.formatAsHtml(this.props.message) }}></p>
      </div>
    )
  }
}

NewsPost.propTypes = {
  accessToken: React.PropTypes.string.isRequired,
  id: React.PropTypes.string.isRequired,
  type: React.PropTypes.string.isRequired,
  isFirst: React.PropTypes.bool.isRequired,
  createdTime: React.PropTypes.string.isRequired,
  link: React.PropTypes.string,
  picture: React.PropTypes.string,
  message: React.PropTypes.string
}
