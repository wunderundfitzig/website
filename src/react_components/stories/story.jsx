'use strict'

import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import Editable from '../_reusables/editable'
import MarkdownEditor from '../_reusables/markdownEditor'

const Story = ({ parentPathname, slug, storyPage, pageNumber, isFirstPage, isLastPage, editMode }, { store }) => (
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

    { !isFirstPage && <Link className='prev arrow' to={`${pageNumber - 1}`}>←</Link> }
    { !isLastPage && <Link className='next arrow' to={`${pageNumber + 1}`}>→</Link> }
  </div>
)

Story.propTypes = {
  storyPage: PropTypes.object.isRequired
}

Story.contextTypes = {
  store: PropTypes.func
}

export default Story
