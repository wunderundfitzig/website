'use strict'

import React, { PropTypes } from 'react'
import fetch from 'node-fetch'
import { Match, Miss, Redirect } from 'react-router'
import StoriesOverview from './storiesOverview'
import Story from './story'

class StoriesPage extends React.Component {
  constructor (props, context) {
    super(props)

    if (!props.stories) {
      context.awaitBeforeServerRender.register({
        promise: fetch(`${process.env.HOST || window.location.origin}/assets/data/stories.json`)
        .then(res => res.json())
        .then(stories => context.store.setState({ stories }))
      })
    }
  }

  render () {
    const { pathname, stories, editMode } = this.props
    if (!stories) return null

    return (
      <div className='inner-content'>
        <Match exactly pattern={`${pathname}/`} render={matchProps => (
          <StoriesOverview {...matchProps} stories={stories} editMode={editMode} />
        )} />
        <Match pattern={`${pathname}/:slug/:pageNumber?`} render={({ params }) => {
          const story = stories.find(story => story.slug === params.slug)
          if (!story) return <Redirect to={`${pathname}/`} />

          const pageNumber = parseInt(params.pageNumber)
          const storyPage = story.pages[pageNumber]
          if (!storyPage) return <Redirect to={`${pathname}/${params.slug}/0`} />

          return <Story
            parentPathname={pathname}
            slug={params.slug}
            storyPage={storyPage}
            pageNumber={pageNumber}
            isFirstPage={pageNumber === 0}
            isLastPage={pageNumber === story.pages.length - 1}
            editMode={editMode}
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
  awaitBeforeServerRender: PropTypes.object,
  store: PropTypes.func
}

export default StoriesPage
