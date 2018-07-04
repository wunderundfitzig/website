'use strict'

export const initialState = {
  markdown: ''
}

export const actions = {
  setMarkdown: (state, markdown) => ({
    ...state,
    markdown: markdown
  })
}

export default { actions, initialState }
