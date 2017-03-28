'use strict'

import React, { PropTypes } from 'react'

export default class Editable extends React.Component {
  static propTypes = {
    editMode: PropTypes.bool,
    children: PropTypes.shape({
      props: PropTypes.shape({
        children: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])
      })
    }),
    onChange: PropTypes.func.isRequired
  }

  render () {
    const { editMode, onChange, children } = this.props
    if (!editMode) return children

    const { props: { children: value, className, ...childProps } } = children
    return (
      <input {...childProps}
        className={`${className} editMode`}
        value={value}
        onChange={e => { onChange(e.target.value) }}
      />
    )
  }
}
