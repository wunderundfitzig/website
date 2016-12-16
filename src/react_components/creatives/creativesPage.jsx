'use strict'

import React, { PropTypes } from 'react'

const throttle = function ({ func, delay }) {
  let block = false
  let timeoutId

  return function () {
    if (timeoutId) clearTimeout(timeoutId)

    if (block) {
      timeoutId = setTimeout(() => { func() }, delay)
    } else {
      block = true
      setTimeout(() => { block = false }, delay)
      func()
    }
  }
}

class CreativesPage extends React.Component {
  constructor (props, context) {
    super(props)

    if (context.initialDataLoader) {
      context.initialDataLoader.requestData([{
        key: 'creatives',
        alwaysReload: false,
        url: 'http://localhost:8080/assets/data/creatives.json'
      }])
    }

    this.sectionRefs = []
    this.state = {
      sectionImageStates: []
    }
  }

  setSectionImageStates () {
    const sectionImageStates = this.sectionRefs.map(el =>
      el.getBoundingClientRect().top - (window.innerHeight * 5 / 8) < 0
    )
    this.setState({ sectionImageStates })
  }

  componentDidMount () {
    this.setSectionImageStates()
    this.scrollHandler = throttle({ func: this.setSectionImageStates.bind(this), delay: 100 })
    window.addEventListener('scroll', this.scrollHandler)
  }

  componentWillReceiveProps () {
    this.setSectionImageStates()
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.scrollHandler)
  }

  render () {
    if (!this.props.sections) return null

    return (
      <article id='creatives-page'>
        { this.props.sections.map((section, index) => {
          const imgInView = index === 0 || this.state.sectionImageStates[index]
          const imgStateString = imgInView ? 'in-view' : 'out-of-view'

          return (
            <section className='creatives-section'
              key={ index }
              ref={ sectionRef => { this.sectionRefs[index] = sectionRef }}
            >
              <span className={ `creatives-image ${ imgStateString }` } style={{
                backgroundImage: `url(${ section.image })`
              }}/>
              <h2 className='creatives-section-title'>{ section.name }</h2>

              { section.paragraphs.map((paragraph, pIndex) =>
                <p key={ pIndex } className='creatives-paragraph'>{ paragraph }</p>
              )}
            </section>
          )
        })}
      </article>
    )
  }
}

CreativesPage.contextTypes = {
  initialDataLoader: PropTypes.object
}
CreativesPage.propTypes = {
  sections: PropTypes.array
}

export default CreativesPage
