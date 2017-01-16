'use strict'

export const initialState = []

export const actions = {
  add: (stories, newStories) => [...(stories || []), ...newStories],

  create: stories => [...stories, {
    slug: `new-${stories.length}`,
    title: 'Neue Story'
  }],

  delete: (stories, { slug }) => stories.filter(story => story.slug !== slug),

  resort: (stories, { newOrder }) => {
    if (newOrder.length !== stories.length) throw new Error('invalid Order')

    const containers = stories.map((story, i) => ({ story, order: newOrder[i] }))
    containers.sort((a, b) => a.order > b.order)
    return containers.map(container => container.story)
  },

  setTitle: (stories, { slug, title }) => {
    const story = stories.find(story => story.slug === slug)
    story.title = title
    return stories
  },

  setSlug: (stories, { slug, newSlug }) => {
    const story = stories.find(story => story.slug === slug)
    story.slug = newSlug
    return stories
  },

  setCover: (stories, { slug, cover }) => {
    const story = stories.find(story => story.slug === slug)
    story.cover = cover
    return stories
  },

  setPageMarkdown: (stories, { slug, pageNumber, markdown }) => {
    const story = stories.find(story => story.slug === slug)
    const page = story.pages[pageNumber]
    page.markdown = markdown
    return stories
  }
}

export default { actions, initialState }