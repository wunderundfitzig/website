'use strict'

import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import MarkdownEditor from '../_reusables/markdownEditor'

const Story = ({ parentPathname, slug, storyPage, pageNumber, isFirstPage, isLastPage, editMode }, { store }) => (
  <div id='story'>
    <h2 className='story-title'>{ storyPage.title }</h2>
    <Link className='close-button' to={parentPathname}>✕</Link>
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
