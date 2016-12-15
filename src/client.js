'use strict'

import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router'
import { InitialDataCollecter } from './initialDataLoader'

import PageWrapper from './react_components/page'

window.addEventListener('load', () => {
  render(<BrowserRouter>
    <InitialDataCollecter>
      <PageWrapper initialData={ window.initialData } />
    </InitialDataCollecter>
  </BrowserRouter>, document)
})
