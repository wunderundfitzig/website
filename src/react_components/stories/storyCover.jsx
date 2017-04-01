/* global FileReader */
'use strict'

import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import HighResImg from '../_lib/highResImg'
import SlugEditor from './slugEditor'

export default class StoriesOverview extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    image: PropTypes.object,
    editMode: PropTypes.bool,
    stories: PropTypes.array.isRequired
  }

  static contextTypes = {
    store: PropTypes.func,
    router: PropTypes.object
  }

  setCover = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const fileReader = new FileReader()
    const fileHandler = e => {
      this.context.store.stories.setCover({
        slug: this.props.slug,
        coverURL: e.target.result
      })
      fileReader.removeEventListener('load', fileHandler)
    }
    fileReader.addEventListener('load', fileHandler)
    fileReader.readAsDataURL(e.target.files[0])
  }

  deleteStory = (e) => {
    this.context.store.stories.delete({ slug: this.props.slug })
    e.stopPropagation()
  }

  openStory = () => {
    if (this.props.dragPhase !== null) return
    this.context.router.transitionTo(`${this.props.slug}/1`)
  }

  render () {
    const { title, slug, image, editMode, stories } = this.props
    const { store } = this.context

    if (!editMode) {
      return (
        <Link to={`${slug}/1`} id='story-cover'>
          <span className='story-image-wrapper'>
            <HighResImg className='story-img' alt={title} image={image} />
          </span>
          <p className='story-title'>{ title }</p>
        </Link>
      )
    }

    return (
      <div id='story-cover' className='editMode'>
        <span className='story-image-wrapper'>
          <HighResImg className='story-img' alt={title} image={image}
            onClick={this.openStory} />
          <div className='edit-buttons'>
            <button className='delete-button'
              onClick={this.deleteStory}>
              löschen
            </button>
            <SlugEditor slug={slug} stories={stories} />
            <input id={`img-selector${slug}`}
              className='file-selector'
              type='file'
              accept='image/*'
              onChange={this.setCover} />
            <label htmlFor={`img-selector${slug}`}>Bild auswählen</label>
          </div>
        </span>
        <input className='story-title-input'
          type='text'
          value={title}
          onChange={e => {
            store.stories.setTitle({ slug: slug, title: e.target.value })
          }}
        />
      </div>
    )
  }
}
