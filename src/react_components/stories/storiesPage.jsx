'use strict'

import React, { PropTypes } from 'react'
import fetch from 'node-fetch'
import { Match, Miss, Redirect } from 'react-router'
import StoriesOverview from './storiesOverview'
import Story from './story'

class StoriesPage extends React.Component {
  constructor (props, context) {
    super(props)
    if (props.stories.length > 0) return

    context.awaitBeforeServerRender.register({
      promise: fetch(`${process.env.HOST || window.location.origin}/api/stories`)
      .then(res => res.json())
      .then(stories => context.store.stories.add(stories))
    })
  }

  render () {
    const { pathname, stories, editMode } = this.props
    if (stories.length === 0) return null

    return (
      <div id='stories-page' className='inner-content'>
        <Match exactly pattern={`${pathname}/`} render={matchProps => (
          <StoriesOverview {...matchProps} stories={stories} editMode={editMode} />
        )} />
        <Match pattern={`${pathname}/:slug/:pageNumber?`} render={({ params }) => {
          const story = stories.find(story => story.slug === params.slug)
          if (!story) return <Redirect to={`${pathname}/`} />

          const pageNumber = parseInt(params.pageNumber) - 1
          const storyPage = story.pages[pageNumber]
          if (!storyPage) return <Redirect to={`${pathname}/${params.slug}/1`} />

          return <Story
            parentPathname={pathname}
            slug={params.slug}
            storyPage={storyPage}
            pageNumber={pageNumber}
            numberOfPages={story.pages.length}
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
