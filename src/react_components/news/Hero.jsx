'use strict'

import React from 'react'

const buzzwords = [
  'Nutzererlebnisse.',
  'Corporate Identities.',
  'Inhaltsarchitektur.',
  'Nutzererlebnisse.'
]

class Hero extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      buzzword: buzzwords[0],
      animationFinished: false
    }
  }

  animateTyping ({ word, backwards = false }) {
    let remainingChars = word.length

    return new Promise(resolve => {
      const intervalID = setInterval(() => {
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
        if (i < buzzwords.length - 1) {
          setTimeout(() => { replaceWord(i) }, 3000)
        } else {
          this.setState({ animationFinished: true })
        }
      })
    }
    setTimeout(replaceWord, 1000)
  }

  render () {
    return (
      <div>
        <h1 className='sloagen'>
          Wir gestalten <strong contentEditable={ this.state.animationFinished } >{ this.state.buzzword }</strong>
        </h1>
        <h2 className='sub-sloagen'>Digital & Analog</h2>

        <div className='contact'>
          <span>+49 (0) 30 864 514 59 | </span>
          <a className='email' href='mailto:info@wunderundfitzig.de'>
            info@wunderundfitzig.de
          </a><br />
          <a href='https://goo.gl/maps/VsHnP' target='_blank'>
            Lausitzer Straße 47 10999 Berlin
          </a>
        </div>
      </div>
    )
  }
}

export default Hero
