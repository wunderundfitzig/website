'use strict'

import React from 'react'

const Hero = ({ news }) => (
  <div>
    <h1 className='sloagen'>
      Wir gestalten <strong>Nutzererlebnisse.</strong>
    </h1>
    <h2 className='sub-sloagen'>Digital & Analog</h2>

    <div className='contact'>
      <span>+49 (0) 30 864 514 59 | </span>
      <a className='email' href='mailto:info@wunderundfitzig.de'>
        info@wunderundfitzig.de
      </a><br />
      <a href='https://goo.gl/maps/VsHnP' target='_blank'>
        Lausitzer Straße 47 10999 Berlin
      </a>
    </div>
  </div>
)

export default Hero
