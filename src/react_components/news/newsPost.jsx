'use strict'

import React from 'react'

export default class NewsPost extends React.Component {

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

    var months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dez']

    return day + '. ' + months[month] + ' ' + year
  }

  /**
  * find first url in message and remove it
  * @param message {string}
  * @return {object} containing the 'url' and the 'message'
  */
  getAndRemoveFirstURL (message) {
    if (!message) return {}

    let regex = /((http|https|ftp):\/\/[\w?=&./-;#~%-]+(?![\w\s?&./;#~%"=-]*>))/
    let matches = message.match(regex)
    let url = null

    if (matches) {
      message = message.replace(regex, '')
      url = matches[0]
    }

    return { url: url, message: message }
  }

  /**
  * format linebreaks and links as html
  * @param message {string}
  * @return {string}
  */
  formatAsHtml (message) {
    if (message) {
      var str = message.replace(/((http|https|ftp):\/\/[\w?=&./-;#~%-]+(?![\w\s?&./;#~%"=-]*>))/g, '<a href="$1" target="_blank">$1</a>')
      return str.replace(/(\r\n)|(\n\r)|\r|\n/g, '<br>')
    }
  }

  render () {
    const { url, message } = this.getAndRemoveFirstURL(this.props.message)

    return (
      <div id='news-post'>
        { /* first element does not show the date */ }
        { !this.props.isFirst &&
          <p className='date'> { this.formatDate(this.props.createdTime) } </p>
        }
        <a href={url} target='_blank' className='link' style={{
          paddingTop: `${this.props.picture.height / this.props.picture.width * 100}%`
        }}>
          <img className='picture' src={this.props.picture.source} />
        </a>
        <p className='message' dangerouslySetInnerHTML={{ __html: this.formatAsHtml(message) }} />
      </div>
    )
  }
}

NewsPost.propTypes = {
  isFirst: React.PropTypes.bool.isRequired,
  createdTime: React.PropTypes.string.isRequired,
  link: React.PropTypes.string,
  picture: React.PropTypes.object,
  message: React.PropTypes.string
}
