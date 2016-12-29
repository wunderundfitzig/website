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

  toggleEditMode: state => ({ ...state, editMode: !state.editMode && !state.isMobile })
}
