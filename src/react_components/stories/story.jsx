import React, { PropTypes } from 'react'

const Story = ({ story }) => (
  <p>{ story.title }</p>
)

Story.propTypes = {
  story: PropTypes.object.isRequired
}

Story.contextTypes = {
  initialDataLoader: PropTypes.object
}

export default Story
