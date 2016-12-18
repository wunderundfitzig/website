'use strict'

import React, { PropTypes } from 'react'
import StoriesOverview from './storiesOverview'
import Story from './story'
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
      <div className='inner-content'>
        <Match exactly pattern={`${pathname}/`} render={matchProps => (
          <StoriesOverview {...matchProps} stories={stories} />
        )} />
        <Match pattern={`${pathname}/:slug/:pageNumber?`} render={({ params }) => {
          const story = stories.find(story => story.slug === params.slug)
          if (!story) return <Redirect to={`${pathname}/`} />

          const pageNumber = parseInt(params.pageNumber)
          const storyPage = story.pages[pageNumber]
          if (!storyPage) return <Redirect to={`${pathname}/${params.slug}/0`} />

          return <Story
            parentPathname={pathname}
            storyPage={storyPage}
            pageNumber={pageNumber}
            isFirstPage={pageNumber === 0}
            isLastPage={pageNumber === story.pages.length - 1}
          />
        }} />
        <Miss render={() => <Redirect to={`${pathname}/`} />} />
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
