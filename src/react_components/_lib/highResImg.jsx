import React, { PropTypes } from 'react'

class HighResImg extends React.Component {
  static propTypes = {
    image: PropTypes.object
  }

  getHighResSrc () {
    if (!this.props.image || !this.props.image.hasHighresVersion) return
    const parts = this.props.image.url.split('.')
    if (parts.length < 2) return

    parts[parts.length - 2] = parts[parts.length - 2] + '@2x'
    return `${parts.join('.')} 2x`
  }

  render () {
    const { image, ...other } = this.props
    const src = image ? image.url : null

    return <img {...other} src={src} srcSet={this.getHighResSrc()} />
  }
}

export default HighResImg
