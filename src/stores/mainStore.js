'use strict'

const MOBILE_WIDTH = 700

export const initialState = {}

export const actions = {
  checkIfMobile: state => {
    if (!window) return state
    const isMobile = window.innerWidth <= MOBILE_WIDTH
    return {
      ...state,
      isMobile,
      editMode: isMobile ? false : state.editMode
    }
  },
  clientLoaded: state => ({ ...state, clientLoaded: true }),
  toggleEditMode: state => ({
    ...state,
    editMode: !state.editMode && !state.isMobile
  })
}

export default { actions, initialState }
