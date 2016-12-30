'use strict'

import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import HighResImg from '../_helpers/highResImg'

class StoriesOverview extends React.Component {
  render () {
    const { title, slug, image, editMode } = this.props

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
                  <button className='delete-button' onClick={() => {
                    this.context.store.deleteStory({ slug: slug })
                  }}>
                    löschen
                  </button>
              }
            </span>
            {
              editMode
                ? <input className='story-title-input'
                    type='text'                        // eslint-disable-line
                    value={title}                      // eslint-disable-line
                    onChange={e => {                   // eslint-disable-line
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
  editMode: PropTypes.bool
}

StoriesOverview.contextTypes = {
  store: PropTypes.func
}

export default StoriesOverview
