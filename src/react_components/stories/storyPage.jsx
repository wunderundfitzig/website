import React, { PropTypes } from 'react'
import marked from 'marked'

const StoryPage = ({ storyPage }) => (
  <div className='story-page'>
    <h2 className='story-title'>{ storyPage.title }</h2>
    <span className='story-image' style={{
      backgroundImage: `url(${storyPage.image})`
    }} />
    <div className='story-text' dangerouslySetInnerHTML={{ __html: marked(storyPage.markdown) }} />

  </div>
)

StoryPage.propTypes = {
  storyPage: PropTypes.object.isRequired
}

export default StoryPage
