/* global FileReader */
'use strict'

import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import HighResImg from '../_lib/highResImg'
import SlugEditor from './slugEditor'

class StoriesOverview extends React.Component {
  render () {
    const { title, slug, image, editMode, stories, dragPhase } = this.props
    const { store, router } = this.context

    if (!editMode) {
      return (
        <Link to={`${slug}/1`} id='story-cover'>
          <span className='story-image-wrapper'>
            <HighResImg className='story-img' alt={title} src={image} />
          </span>
          <p className='story-title'>{ title }</p>
        </Link>
      )
    }

    return (
      <div id='story-cover' className='editMode'>
        <span className='story-image-wrapper'>
          <HighResImg className='story-img' alt={title} src={image}
            onClick={(e) => {
              if (dragPhase !== null) return
              router.transitionTo(`${slug}/1`)
            }} />
          <div className='edit-buttons'>
            <button className='delete-button' onClick={(e) => {
              store.stories.delete({ slug: slug })
              e.stopPropagation()
            }}>
              löschen
            </button>
            <SlugEditor slug={slug} stories={stories} />
            <input id={`img-selector${slug}`}
              className='file-selector'
              type='file'
              accept='image/*'
              onChange={e => {
                e.preventDefault()
                e.stopPropagation()
                const fileReader = new FileReader()
                const fileHandler = e => {
                  store.stories.setCover({ slug, cover: e.target.result })
                  fileReader.removeEventListener('load', fileHandler)
                }
                fileReader.addEventListener('load', fileHandler)
                fileReader.readAsDataURL(e.target.files[0])
              }}
            />
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

StoriesOverview.propTypes = {
  title: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  image: PropTypes.string,
  editMode: PropTypes.bool,
  stories: PropTypes.array.isRequired
}

StoriesOverview.contextTypes = {
  store: PropTypes.func,
  router: PropTypes.object
}

export default StoriesOverview
