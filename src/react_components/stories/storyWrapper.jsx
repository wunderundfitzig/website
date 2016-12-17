'use strict'

import React, { PropTypes } from 'react'
import StoryPage from './storyPage'
import { Match, Redirect } from 'react-router'

const Story = ({ pathname, story }) => (
  <div>
    <Match pattern={`${pathname}/:page?`} render={matchProps => {
      const storyPage = story.pages[matchProps.params.page]
      if (!storyPage) return <Redirect to={`${pathname}/0`} />
      return <StoryPage storyPage={storyPage} />
    }} />
  </div>
)

Story.propTypes = {
  story: PropTypes.object.isRequired
}

export default Story
