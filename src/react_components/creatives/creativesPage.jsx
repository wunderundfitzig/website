/* global FileReader */
'use strict'

import React, { PropTypes } from 'react'
import Editable from '../_lib/editable'
import MarkdownEditor from '../_lib/markdownEditor'
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

export default class CreativesPage extends React.Component {
  static propTypes = {
    creatives: PropTypes.array,
    isMobile: PropTypes.bool,
    editMode: PropTypes.bool
  }
  static contextTypes = {
    awaitBeforeServerRender: PropTypes.object,
    store: PropTypes.func
  }

  constructor (props, context) {
    super(props)

    if (props.creatives.length === 0) {
      context.awaitBeforeServerRender.register({
        promise: fetch(`${process.env.HOST ||
                       window.location.origin}/api/creatives`)
          .then(res => res.json())
          .then(creatives => { context.store.creatives.add(creatives) })
      })
    }

    this.scrollHandler
    this.sectionRefs = []
    this.afterUpdateGoToSection = null
    this.state = { currentSectionIndex: 0 }
  }

  componentDidMount () {
    this.getCurrentSectionFromScrollPosition()
    this.scrollHandler = throttle({
      func: this.getCurrentSectionFromScrollPosition,
      delay: 100
    })
    window.addEventListener('scroll', this.scrollHandler)
  }

  componentDidUpdate (prevProps) {
    if (this.afterUpdateGoToSection !== null) {
      this.scrollSectionIntoView({ section: this.afterUpdateGoToSection })
      this.afterUpdateGoToSection = null
    }

    if (prevProps === this.props) return
    this.getCurrentSectionFromScrollPosition()
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.scrollHandler)
  }

  getCurrentSectionFromScrollPosition = () => {
    if (this.props.isMobile) return

    const currentSectionIndex = this.sectionRefs
      .filter(ref => ref !== null)
      .reduce((currentSectionIndex, sectionRef, index) => {
        const topOffset = sectionRef.getBoundingClientRect().top
        const twoThirds = (window.innerHeight * 2 / 3)
        return topOffset - twoThirds < 0 ? index : currentSectionIndex
      }, 0)

    if (this.state.currentSectionIndex === currentSectionIndex) return
    this.setState({ currentSectionIndex })
  }

  scrollSectionIntoView = ({ section, duration = 200 }) => {
    const SPACING = 40
    const startOffset = window.pageYOffset
    const endOffset = this.sectionRefs[section].offsetTop - SPACING
    const offsetDifference = endOffset - startOffset

    let startTime = null
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      let progress = (timestamp - startTime) / duration
      if (progress > 1) progress = 1

      window.scrollTo(0, startOffset + offsetDifference * progress)
      if (progress < 1) window.requestAnimationFrame(animate)
    }
    window.requestAnimationFrame(animate)
  }

  deleteSection = (sectionIndex) => {
    this.context.store.creatives.delete({ index: sectionIndex })
    this.afterUpdateGoToSection = sectionIndex > 0 ? sectionIndex - 1 : 0
  }

  createSection = () => {
    const newCreatives = this.context.store.creatives.create()
    this.afterUpdateGoToSection = newCreatives.length - 1
  }

  setSectionImage = ({ event, sectionIndex }) => {
    event.preventDefault()
    const fileReader = new FileReader()
    const fileHandler = e => {
      this.context.store.creatives.setImage({
        index: sectionIndex,
        imageURL: e.target.result })
      fileReader.removeEventListener('load', fileHandler)
    }
    fileReader.addEventListener('load', fileHandler)
    fileReader.readAsDataURL(event.target.files[0])
  }

  render () {
    const { creatives, editMode } = this.props
    const { currentSectionIndex } = this.state
    const { store } = this.context
    if (!creatives) return null

    return (
      <article id='creatives-page' className='inner-content'>
        {creatives.map((section, index) => {
          const isCurrentSection = index === currentSectionIndex

          return (
            <section className='creatives-section'
              key={index}
              ref={sectionRef => { this.sectionRefs[index] = sectionRef }}>

              <Editable editMode={editMode}
                onChange={name => { store.creatives.setName({ index, name }) }}>
                <h2 className='creatives-section-title'>{ section.name }</h2>
              </Editable>
              <div
                className={`creatives-image ${isCurrentSection && 'current-image'}`}
                style={{
                  backgroundImage: `url(${section.image.url})`,
                  ...section.image.styles
                }} />
              <MarkdownEditor className='creatives-text'
                editMode={editMode}
                markdown={section.markdown}
                onChange={markdown => {
                  store.creatives.setMarkdown({ index, markdown })
                }} />
            </section>
          )
        })}

        { editMode &&
          <div>
            <div className='edit-panel'>
              { creatives.length > 1 &&
                <button className='delete-button'
                  onClick={() => { this.deleteSection(currentSectionIndex) }}>
                  Abschnitt { currentSectionIndex + 1 } löschen
                </button>
              }
              <br />
              <input id='img-selector'
                className='file-selector'
                type='file'
                accept='image/*'
                onChange={event => {
                  this.setSectionImage({event, sectionIndex: currentSectionIndex})
                }} />
              <label className='edit-image-button' htmlFor='img-selector'>
                Bild auswählen
              </label>

            </div>
            <button className='create-button' onClick={this.createSection}>
              Abschnitt hinzufügen
            </button>
          </div>
        }
      </article>
    )
  }
}
