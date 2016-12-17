import React, { PropTypes } from 'react'
import StoriesOverview from './storiesOverview'
import StoryWrapper from './storyWrapper'
import { Match, Miss, Redirect } from 'react-router'

class StoriesPage extends React.Component {
  constructor (props, context) {
    super(props)

    if (context.initialDataLoader) {
      context.initialDataLoader.requestData([{
        key: 'stories',
        alwaysReload: true,
        url: `${process.env.HOST || window.location.origin}/assets/data/stories.json`
      }])
    }
  }

  render () {
    const { pathname, stories } = this.props
    if (!stories) return null

    return (
      <div id='storiesPage' className='inner-content'>
        <Match exactly pattern={`${pathname}/`} render={matchProps => (
          <StoriesOverview {...matchProps} stories={stories} />
        )} />
        <Match pattern={`${pathname}/:slug`} render={matchProps => {
          const story = stories.find(story => story.slug === matchProps.params.slug)

          if (!story) return <Redirect to={`${pathname}/`} />
          return <StoryWrapper {...matchProps} story={story} />
        }} />
      </div>
    )
  }
}

StoriesPage.propTypes = {
  stories: PropTypes.array,
  pathname: PropTypes.string
}

StoriesPage.contextTypes = {
  initialDataLoader: PropTypes.object
}

export default StoriesPage
