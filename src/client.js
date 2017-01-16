'use strict'

import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router'
import StoreProvider from './stores/_storeProvider'
import storeFactory from './stores/_storeFactory'
import Page from './react_components/page'

window.addEventListener('load', () => {
  const store = storeFactory.createStore({ initialData: window.initialData })
  render(<BrowserRouter>
    <StoreProvider store={store}>
      <Page />
    </StoreProvider>
  </BrowserRouter>, document)
})
