'use strict'

export const initialState = []

export const actions = {
  add: (news, newNews) => [...news, ...newNews]
}

export default { actions, initialState }
