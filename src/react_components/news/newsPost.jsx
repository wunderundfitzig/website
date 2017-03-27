'use strict'

import React from 'react'

export default class NewsPost extends React.Component {
  static propTypes = {
    isFirst: React.PropTypes.bool.isRequired,
    createdTime: React.PropTypes.string.isRequired,
    picture: React.PropTypes.object,
    message: React.PropTypes.string
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

    var months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug',
      'Sep', 'Oct', 'Nov', 'Dez']

    return day + '. ' + months[month] + ' ' + year
  }

  /**
  * find first url in message and remove it
  * @param message {string}
  * @return {object} containing the 'url' and the 'message'
  */
  getAndRemoveFirstURL (message) {
    if (!message) return {}

    const regex =
      /((http|https|ftp):\/\/[\w?=&./-;#~%-]+(?![\w\s?&./;#~%"=-]*>))/
    const matches = message.match(regex)
    let text = message
    let url

    if (matches) {
      text = message.replace(regex, '')
      url = matches[0]
    }

    return { url, text }
  }

  /**
  * format linebreaks and links as html
  * @param message {string}
  * @return {string}
  */
  formatAsHtml (message) {
    if (message) {
      var str = message
        .replace(/((http|https|ftp):\/\/[\w?=&./-;#~%-]+(?![\w\s?&./;#~%"=-]*>))/g, '<a href="$1" target="_blank">$1</a>')
      return str.replace(/(\r\n)|(\n\r)|\r|\n/g, '<br>')
    }
  }

  render () {
    const { isFirst, createdTime, picture, message } = this.props
    const { url, text } = this.getAndRemoveFirstURL(message)

    return (
      <div id='news-post'>
        { /* first element does not show the date */ }
        { !isFirst &&
          <p className='date'> { this.formatDate(createdTime) } </p>
        }
        <a href={url} target='_blank' className='link' style={{
          paddingTop: `${picture.height / picture.width * 100}%`
        }}>
          <img className='picture' src={picture.source} />
        </a>
        <p className='message'
          dangerouslySetInnerHTML={{ __html: this.formatAsHtml(text) }} />
      </div>
    )
  }
}
