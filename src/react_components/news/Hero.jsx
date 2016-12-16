'use strict'

import React from 'react'

const buzzwords = [
  'Nutzererlebnisse.',
  'Corporate Identities.',
  'Informationsarchitektur.',
  'Nutzererlebnisse.'
]

let intervalID, timeoutId

class Hero extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      buzzword: buzzwords[0]
    }
  }

  animateTyping ({ word, backwards = false }) {
    let remainingChars = word.length

    return new Promise(resolve => {
      intervalID = setInterval(() => {
        let charecterOffset = --remainingChars
        if (!backwards) {
          charecterOffset *= -1
          if (charecterOffset === 0) charecterOffset = word.length
        }
        this.setState({ buzzword: word.slice(0, charecterOffset) })
        if (remainingChars === 0) {
          clearInterval(intervalID)
          resolve()
        }
      }, backwards ? 50 : 150)
    })
  }

  componentDidMount () {
    const replaceWord = (i = 0) => {
      this.animateTyping({ word: buzzwords[i], backwards: true })
      .then(() => this.animateTyping({ word: buzzwords[++i] }))
      .then(() => {
        if (i < buzzwords.length - 1) timeoutId = setTimeout(() => { replaceWord(i) }, 3000)
      })
    }
    timeoutId = setTimeout(replaceWord, 1000)
  }

  componentWillUnmount () {
    clearInterval(intervalID)
    clearTimeout(timeoutId)
  }

  render () {
    return (
      <div>
        <h1 className='sloagen'>
          Wir gestalten <strong className='buzzword'>{ this.state.buzzword }</strong>
        </h1>
        <h2 className='sub-sloagen'>Digital & Analog</h2>

        <div className='contact'>
          <p className='phone-and-mail'>
            <span>+49 (0) 30 864 514 59 | </span>
            <a className='email' href='mailto:info@wunderundfitzig.de'>
              info@wunderundfitzig.de
            </a>
          </p>
          <a href='https://goo.gl/maps/VsHnP' target='_blank'>
            Lausitzer Straße 47 10999 Berlin
          </a>
        </div>
      </div>
    )
  }
}

export default Hero
