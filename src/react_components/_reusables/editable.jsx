import React, { PropTypes } from 'react'

class Editable extends React.Component {

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

Editable.propTypes = {
  editMode: PropTypes.bool,
  children: PropTypes.shape({
    props: PropTypes.shape({
      children: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])
    })
  }),
  onChange: PropTypes.func.isRequired
}

export default Editable
