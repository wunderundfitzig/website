'use strict'

export const initialState = []

export const actions = {
  add: (sections, newSections) => [...sections, ...newSections],

  create: sections => [...sections, {
    name: 'Neuer Abschnitt',
    markdown: '',
    image: {}
  }],

  delete: (sections, { index }) => sections.filter((_, i) => i !== index),

  setName: (sections, { index, name }) => {
    sections[index].name = name
    return sections
  },

  setImage: (sections, { index, imageURL }) => {
    sections[index].image.url = imageURL
    sections[index].image.imageNeedsUpload = true
    return sections
  },

  setMarkdown: (sections, { index, markdown }) => {
    sections[index].markdown = markdown
    return sections
  }
}

export default { actions, initialState }
