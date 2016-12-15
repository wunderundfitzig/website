'use strict'

import React from 'react'

let CreativesPage = (props) => (
  <article id='creatives-page'>
    <section className='creatives-section' data-section-name='hr-wunder'>
      <span className='creatives-image' style={{
        backgroundImage: 'url(/assets/img/people/hrWunderr.jpg)'
      }}/>
      <h2 className='creatives-section-title'>Herr Wunder</h2>
      <p className='creatives-section-paragraph'>
        Herr Wunder konzeptioniert und programmiert
        Webseiten.
      </p>
      <p className='creatives-section-paragraph'>
        Konzepte und Design hat er gerne modern und radikal schlicht.
        Ziel ist es nur was wirklich gebraucht wird umsusetzen,
        und das mit größtmöglicher Perfektion.
      </p>
    </section>

    <div className='inner-content sticker' id='frFitzig'>
      <div className='left-person' style={{ backgroundImage: 'url(/assets/img/people/frFitzig.jpg)', left: '-10%' }}/>
      <div className='right-text'>
        <h2>Frau Fitzig</h2>
        <div className='paragraphs'>
          <p>
            Formen, Farbe, Strategien!
          </p>
          <p>
            Frau Fitzig spricht fliesend Gestaltung.<br/>
            Mit Begeisterung etwickelt sie Markenbilder,
            die nicht nur verdammt gut aussehen sondern klar
            durchdacht sind.
          </p>
        </div>
      </div>
    </div>

    <div className='inner-content sticker' id='hrReich'>
      <div className='right-person' style={{ backgroundImage: 'url(/assets/img/people/hrReich.jpg)' }}/>
      <div className='text'>
        <h2>Herr Reich</h2>
        <div className='paragraphs'>
          <p>
            Seit 2011 studiert Herr Reich internationale Medieninformatik in Berlin.
          </p>
          <p>
            Als Teil der Generation Praktikum arbeitete er in Freiburg bei der Werkstatt für kreative Konzepte.
          </p>
          <p>
            Bei der linkbird GmbH in Berlin war er Teil des SEO Teams. Und später entwickelte er viele viele kleine und große Seiten für Common People Interactice in Barcelona.
          </p>
        </div>
      </div>
    </div>

    <div className='inner-content sticker' id='frSpringmann'>
      <div className='left-person' style={{ backgroundImage: 'url(/assets/img/people/frSpringmann.jpg)' }}/>
      <div className='right-text'>
        <h2>Frau Springmann</h2>
        <div className='paragraphs'>
          <p>
            Frau Springmann entstammt nicht nur einer Künstlerfamilie, sie ist seit 2010 auch staatlich geprüfte Grafikdesignerin.
          </p>
          <p>
            Design allein war ihr aber nicht genug darum studierte sie,
            nach einem Praktikum bei Schürmann PR, Wirtschfaskomikation in Berlin
          </p>
          <p>
            Praxiserfahrung sammelte sie dann bei MetaDesign in Berlin.
          </p>
          <p>
            Inzwischen studiert sie Gesellschafts- und Wirtschaftskommunikation an der Universität der Künste Berlin.
          </p>
        </div>
      </div>
    </div>

    <div className='inner-content sticker' id='MartinaManuel'>
      <div className='center-text'>
        <h2>Martina &amp; Manuel</h2>
        <div className='paragraphs'>
          <p>
            Wenn sie gerade mal nicht von einem Termin zum nächsten hetzt, sitzt Martina in der heimischen Küche und träumt von Luftschlössern oder Meister Proper.
          </p>
          <p>
            Manuel genießt sein Lotterleben in Berlin. Lange Reden über sinnvolle und sinnfreie Dinge gehören zu seinen absoluten Lieblingsbeschäftigungen.<br/>
            Ab und zu kann man ihn in einem Hipster Cafe antreffen. Hier bestellt er seine Inspiration.
          </p>
        </div>
      </div>
      <div className='center-person' style={{ backgroundImage: 'url(/assets/img/people/manuMartina.jpg)' }}/>
    </div>
  </article>
)

export default CreativesPage
