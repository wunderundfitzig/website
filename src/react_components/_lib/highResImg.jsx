import React, { PropTypes } from 'react'

class HighResImg extends React.Component {
  static propTypes = {
    src: PropTypes.string
  }

  getHighResSrc () {
    if (!this.props.src) return
    const parts = this.props.src.split('.')
    if (parts.length < 2) return

    parts[parts.length - 2] = parts[parts.length - 2] + '@2x'
    return `${parts.join('.')} 2x`
  }

  render () {
    return <img {...this.props} srcSet={this.getHighResSrc()} />
  }
}

export default HighResImg
