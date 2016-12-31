'use strict'

import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import HighResImg from '../_helpers/highResImg'
import SlugEditor from './slugEditor'

class StoriesOverview extends React.Component {
  render () {
    const { title, slug, image, editMode, stories } = this.props

    return (
      <Link to={`${slug}/0`}>{({ href, onClick }) => {
        const clickHandler = editMode ? e => e.preventDefault() : onClick
        const url = editMode ? '' : href
        const className = `story-link ${editMode && 'editMode'}`

        return (
          <a className={className} onClick={clickHandler} href={url}>
            <span className='story-image-wrapper'>
              <HighResImg className='story-img' alt={title} src={image} />
              {
                editMode &&
                  <div className='edit-buttons'>
                    <button className='delete-button' onClick={() => {
                      this.context.store.deleteStory({ slug: slug })
                    }}>
                      löschen
                    </button>
                    <SlugEditor slug={slug} stories={stories} />
                    <button className='edit-slug-button'>Bild auswählen</button>
                  </div>
              }
            </span>
            {
              editMode
                ? <input className='story-title-input'
                  type='text'
                  value={title}
                  onChange={e => {
                    this.context.store.setStoryTitle({ slug: slug, title: e.target.value })
                  }}
                />
                : <p className='story-title'>{ title }</p>
            }
          </a>
        )
      }}</Link>
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
  store: PropTypes.func
}

export default StoriesOverview
