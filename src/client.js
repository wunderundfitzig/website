'use strict'

import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router'
import Hover from 'hover'
import StoreProvider from './storeProvider'
import Page from './react_components/page'
import storeDescription from './store'

window.addEventListener('load', () => {
  const store = new Hover(storeDescription, window.initialData)
  render(<BrowserRouter>
    <StoreProvider store={store}>
      <Page />
    </StoreProvider>
  </BrowserRouter>, document)
})
