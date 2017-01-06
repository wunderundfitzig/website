'use strict'

const MOBILE_WIDTH = 700

export default {
  setState: (state, newState) => ({...state, ...newState}),

  checkIfMobile: state => {
    if (!window) return { ...state, isMobile: false }
    const isMobile = window.innerWidth <= MOBILE_WIDTH

    return { ...state, isMobile, editMode: false }
  },

  clientLoaded: state => ({ ...state, clientLoaded: true }),

  toggleEditMode: state => ({ ...state, editMode: !state.editMode && !state.isMobile }),

  addStory: state => {
    const { stories } = state
    stories.push({
      slug: `new-${stories.length}`,
      title: 'Neue Story'
    })
    return { ...state, stories }
  },

  deleteStory: (state, { slug }) => {
    const { stories } = state
    const i = stories.findIndex(story => story.slug === slug)
    stories.splice(i, 1)
    return { ...state, stories }
  },

  setStoryTitle: (state, { slug, title }) => {
    const { stories } = state
    const story = stories.find(story => story.slug === slug)
    story.title = title
    return { ...state, stories }
  },

  setStorySlug: (state, { slug, newSlug }) => {
    const { stories } = state
    const story = state.stories.find(story => story.slug === slug)
    story.slug = newSlug
    return { ...state, stories }
  },

  setStoryCover: (state, { slug, cover }) => {
    const { stories } = state
    const story = state.stories.find(story => story.slug === slug)
    story.cover = cover
    return { ...state, stories }
  }
}
