'use strict'

import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import marked from 'marked'

const renderer = new marked.Renderer()
// override markdown link render method
// to add target="_blank" to links
renderer.link = function (href, title, text) {
  if (this.options.sanitize) {
    try {
      var prot = decodeURIComponent(unescape(href)).replace(/[^\w:]/g, '').toLowerCase()
    } catch (e) { return '' }
    if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0) return ''
  }
  var out = '<a href="' + href + '" target="_blank"'
  if (title) out += ' title="' + title + '"'
  out += '>' + text + '</a>'
  return out
}

const Story = ({ parentPathname, storyPage, pageNumber, isFirstPage, isLastPage }) => (
  <div id='story'>
    <h2 className='story-title'>{ storyPage.title }</h2>
    <Link className='close-button' to={parentPathname}>✕</Link>
    <span className='story-image' style={{
      backgroundImage: `url(${storyPage.image})`,
      ...storyPage.imageStyles
    }} />
    <div className='story-text' dangerouslySetInnerHTML={{ __html: marked(storyPage.markdown, {
      renderer: renderer,
      sanitize: true
    })}} />

    { !isFirstPage && <Link className='prev arrow' to={`${pageNumber - 1}`}>←</Link> }
    { !isLastPage && <Link className='next arrow' to={`${pageNumber + 1}`}>→</Link> }
  </div>
)

Story.propTypes = {
  storyPage: PropTypes.object.isRequired
}

export default Story