'use strict'

import React from 'react'

export default class PsswordPropmt extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isVisible: false,
      password: ''
    }
  }

  handleInput = (e) => {
    this.setState({ password: e.target.value })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { password } = this.state
    if (password === '') return this.reject('empty password')

    this.resolve(password)
    this.setState({ isVisible: false, password: '' })
  }

  handleCancel = (e) => {
    e.preventDefault()
    this.setState({ isVisible: false, password: '' })
    this.reject('canceled')
    window.removeEventListener('keydown', this.keyListener)
  }

  requestPassword = () => {
    this.setState({ isVisible: true, password: '' })
    if (this.input) this.input.focus()
    this.keyListener = window.addEventListener('keydown', e => {
      if (e.keyCode === 27) this.handleCancel()
    })

    return new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }

  render () {
    const { isVisible, password } = this.state
    if (!isVisible) return null

    return (
      <div id='password-promt' className='overlay'>
        <form className='password-promt'
          onReset={this.handleCancel}
          onSubmit={this.handleSubmit}
        >
          <label>Bitte Passwort eingeben:</label>
          <input
            ref={i => { this.input = i }}
            onInput={this.handleInput}
            type='password' />
          <button className='cancel-button' type='reset'>
            abbrechen
          </button>
          <button className='submit-button'
            type='submit'
            disabled={password === ''}
          >
            absenden
          </button>
        </form>
      </div>
    )
  }
}
