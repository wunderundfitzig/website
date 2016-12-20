'use strict'

const MOBILE_WIDTH = 700

export default {
  setState: (state, newState) => ({...state, ...newState}),

  checkIfMobile: state => {
    if (!window) return { ...state, isMobile: false }
    return { ...state, isMobile: window.innerWidth <= MOBILE_WIDTH }
  },

  clientLoaded: state => ({ ...state, clientLoaded: true })
}
