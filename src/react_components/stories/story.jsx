/* global FileReader */
'use strict'

import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import Editable from '../_reusables/editable'
import MarkdownEditor from '../_reusables/markdownEditor'

const Story = ({ parentPathname, slug, storyPage, pageNumber, numberOfPages, editMode },
{ store, router }) => {
  const isFirstPage = pageNumber === 0
  const isLastPage = pageNumber === numberOfPages - 1
  return (
    <div id='story'>
      <Editable editMode={editMode} onChange={title => {
        store.stories.setPageTitle({ slug, pageNumber, title })
      }}>
        <h2 className='story-title'>{ storyPage.title }</h2>
      </Editable>
      <Link className={`close-button ${editMode && 'editMode'}`} to={parentPathname}>✕</Link>
      <div className='story-image' style={{
        backgroundImage: `url(${storyPage.image})`,
        ...storyPage.imageStyles
      }}>
        { editMode &&
          <div className='edit-panel'>
            <button className='delete-page-button' onClick={() => {
              store.stories.deletePage({ slug, pageNumber })
            }}>Seite löschen</button>
            <button className='create-page-button' onClick={() => {
              const newPageNumber = pageNumber + 1
              store.stories.createPage({ slug, newPageNumber })
              router.transitionTo(`${newPageNumber + 1}`)
            }}>Neue Seite erstellen</button>
            <input id={`img-selector${slug}`}
              className='file-selector'
              type='file'
              accept='image/*'
              onChange={e => {
                e.preventDefault()
                const fileReader = new FileReader()
                const fileHandler = e => {
                  store.stories.setPageImage({
                    slug,
                    pageNumber,
                    image: e.target.result
                  })
                  fileReader.removeEventListener('load', fileHandler)
                }
                fileReader.addEventListener('load', fileHandler)
                fileReader.readAsDataURL(e.target.files[0])
              }}
            />
            <label className='edit-image-button' htmlFor={`img-selector${slug}`}>Bild auswählen</label>
          </div>
        }
      </div>
      <MarkdownEditor className='story-text' editMode={editMode} markdown={storyPage.markdown} onChange={markdown => {
        store.stories.setPageMarkdown({ slug, pageNumber, markdown })
      }} />

      { (editMode && numberOfPages > 1) &&
        <div className='page-number-panel'>
          Seite:
          <button className='page-number-button'
            disabled={isFirstPage}
            onClick={() => {
              const newPageNumber = pageNumber - 1
              store.stories.setPageNumber({ slug, pageNumber, newPageNumber })
              router.transitionTo(`${newPageNumber + 1}`)
            }}
          >-</button>
          <span className='page-number'>{ pageNumber + 1 }</span> / { numberOfPages }
          <button className='page-number-button'
            disabled={isLastPage}
            onClick={() => {
              const newPageNumber = pageNumber + 1
              store.stories.setPageNumber({ slug, pageNumber, newPageNumber })
              router.transitionTo(`${newPageNumber + 1}`)
            }}
          >+</button>
        </div>
      }
      { !isFirstPage &&
        <Link className='prev arrow' to={`${pageNumber}`}>←</Link>
      }
      { !isLastPage &&
        <Link className='next arrow' to={`${pageNumber + 2}`}>→</Link>
      }
    </div>
  )
}

Story.propTypes = {
  storyPage: PropTypes.object.isRequired
}

Story.contextTypes = {
  store: PropTypes.func,
  router: PropTypes.object
}

export default Story
