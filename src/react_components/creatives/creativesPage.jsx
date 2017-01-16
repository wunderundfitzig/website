'use strict'

import React, { PropTypes } from 'react'
import MarkdownEditor from '../_reusables/markdownEditor'
import fetch from 'node-fetch'

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

    if (props.creatives.length === 0) {
      context.awaitBeforeServerRender.register({
        promise: fetch(`${process.env.HOST || window.location.origin}/assets/data/creatives.json`)
        .then(res => res.json())
        .then(creatives => { context.store.creatives.add(creatives) })
      })
    }

    this.scrollHandler
    this.sectionRefs = []
    this.state = {
      sectionImageStates: []
    }
  }

  setSectionImageStates () {
    if (this.props.isMobile) return

    const sectionImageStates = this.sectionRefs.map(el =>
      el.getBoundingClientRect().top - (window.innerHeight * 2 / 3) < 0
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
    const { creatives, editMode } = this.props
    const { store } = this.context
    if (!creatives) return null

    return (
      <article id='creatives-page' className='inner-content'>
        {creatives.map((section, index) => {
          const imgInView = index === 0 || this.state.sectionImageStates[index]
          const imgStateString = imgInView ? 'in-view' : 'out-of-view'

          return (
            <section className='creatives-section'
              key={index}
              ref={sectionRef => { this.sectionRefs[index] = sectionRef }}
            >
              <h2 className='creatives-section-title'>{ section.name }</h2>
              <span className={`creatives-image ${imgStateString}`} style={{
                backgroundImage: `url(${section.image})`
              }} />

              <MarkdownEditor className='creatives-text' editMode={editMode} markdown={section.markdown} onChange={markdown => {
                store.creatives.setMarkdown({ index, markdown })
              }} />
            </section>
          )
        })}
      </article>
    )
  }
}

CreativesPage.propTypes = {
  creatives: PropTypes.array,
  isMobile: PropTypes.bool,
  editMode: PropTypes.bool
}
CreativesPage.contextTypes = {
  awaitBeforeServerRender: PropTypes.object,
  store: PropTypes.func
}

export default CreativesPage
