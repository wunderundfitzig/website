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
      <span className='story-image' style={{
        backgroundImage: `url(${storyPage.image})`,
        ...storyPage.imageStyles
      }} />
      <MarkdownEditor className='story-text' editMode={editMode} markdown={storyPage.markdown} onChange={markdown => {
        store.stories.setPageMarkdown({ slug, pageNumber, markdown })
      }} />

      { !isFirstPage &&
        <Link className='prev arrow' to={`${pageNumber - 1}`}>←</Link>
      }
      { !isLastPage &&
        <Link className='next arrow' to={`${pageNumber + 1}`}>→</Link>
      }
      { editMode &&
        <div className='edit-panel'>
          <button className='delete-page-button' onClick={() => {
            store.stories.deletePage({ slug, pageNumber })
          }}>Seite löschen</button>
          <button className='create-page-button' onClick={() => {
            const newPageNumber = pageNumber + 1
            store.stories.createPage({ slug, newPageNumber })
            router.transitionTo('' + newPageNumber)
          }}>Neue Seite erstellen</button>
          { numberOfPages > 1 &&
            <p className='page-number-panel'>
              Seite:
              <button className='page-number-button'
                disabled={isFirstPage}
                onClick={() => {
                  const newPageNumber = pageNumber - 1
                  store.stories.setPageNumber({ slug, pageNumber, newPageNumber })
                  router.transitionTo('' + newPageNumber)
                }}
              >-</button>
              <span className='page-number'>{ pageNumber + 1 }</span> / { numberOfPages }
              <button className='page-number-button'
                disabled={isLastPage}
                onClick={() => {
                  const newPageNumber = pageNumber + 1
                  store.stories.setPageNumber({ slug, pageNumber, newPageNumber })
                  router.transitionTo('' + newPageNumber)
                }}
              >+</button>
            </p>
          }
        </div>
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
