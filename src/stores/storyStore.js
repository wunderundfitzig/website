'use strict'

export const initialState = []

export const actions = {
  add: (stories, newStories) => [...(stories || []), ...newStories],

  create: stories => [...stories, {
    slug: `new-${stories.length}`,
    cover: {},
    title: 'Neue Story'
  }],

  delete: (stories, { slug }) => stories.filter(story => story.slug !== slug),

  resort: (stories, { newOrder }) => {
    if (newOrder.length !== stories.length) throw new Error('invalid Order')

    const containers = stories.map((story, i) =>
      ({ story, order: newOrder[i] }))
    containers.sort((a, b) => a.order > b.order ? 1 : -1)
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

  setCover: (stories, { slug, coverURL }) => {
    const story = stories.find(story => story.slug === slug)
    story.cover.url = coverURL
    story.cover.imageNeedsUpload = true
    return stories
  },

  setPageTitle: (stories, { slug, pageNumber, title }) => {
    const story = stories.find(story => story.slug === slug)
    const page = story.pages[pageNumber]
    page.title = title
    return stories
  },

  setPageImage: (stories, { slug, pageNumber, imageURL }) => {
    const story = stories.find(story => story.slug === slug)
    const page = story.pages[pageNumber]
    page.image.url = imageURL
    page.image.imageNeedsUpload = true
    return stories
  },

  setPageMarkdown: (stories, { slug, pageNumber, markdown }) => {
    const story = stories.find(story => story.slug === slug)
    const page = story.pages[pageNumber]
    page.markdown = markdown
    return stories
  },

  deletePage: (stories, { slug, pageNumber }) => {
    const story = stories.find(story => story.slug === slug)
    story.pages.splice(pageNumber, 1)
    return stories
  },

  createPage: (stories, { slug, newPageNumber }) => {
    const story = stories.find(story => story.slug === slug)
    story.pages.splice(newPageNumber, 0, {
      title: story.title,
      image: { url: '' },
      markdown: ''
    })
    return stories
  },

  setPageNumber: (stories, { slug, pageNumber, newPageNumber }) => {
    const story = stories.find(story => story.slug === slug)
    const page = story.pages.splice(pageNumber, 1)[0]
    story.pages.splice(newPageNumber, 0, page)
    return stories
  }
}

export default { actions, initialState }
