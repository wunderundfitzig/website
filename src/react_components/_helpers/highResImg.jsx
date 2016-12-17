import React, { PropTypes } from 'react'

class HighResImg extends React.Component {

  getHighResSrc () {
    if (!this.props.src) return
    const parts = this.props.src.split('.')
    if (parts.length < 2) return

    parts[parts.length - 2] = parts[parts.length - 2] + '@2x'
    return parts.join('.')
  }

  render () {
    return <img {...this.props} srcSet={this.getHighResSrc()} />
  }
}

HighResImg.propTypes = {
  src: PropTypes.string
}

export default HighResImg
