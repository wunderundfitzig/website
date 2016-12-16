'use strict'

import React from 'react'

const persons = [
  {
    name: 'Martina Springmann',
    image: '/assets/img/people/springmann.jpg',
    paragraphs: [
      `Formen, Farbe, Strategien!`,
      `Martina spricht fliesend Gestaltung.
      Mit Begeisterung etwickelt sie Markenbilder,
      die nicht nur verdammt gut aussehen sondern klar
      durchdacht sind.`,
      `Sie ist nicht nur staatlich geprüfte Grafikdesignerin
      sondern entstammt auch einer Künstlerfamilie.`,
      `Design allein war ihr aber nicht genug darum schloss sie noch ein Studium in
      Wirtschfaskomikation ab. Praxiserfahrung sammelte sie dann bei MetaDesign in Berlin.`,
      `Inzwischen studiert sie Gesellschafts- und Wirtschaftskommunikation an der Universität der Künste Berlin.`,
      `Wenn sie gerade mal nicht von einem Termin zum nächsten hetzt, sitzt Martina in der heimischen Küche und träumt von Luftschlössern oder Meister Proper.`
    ]
  }, {
    name: 'Manuel Reich',
    image: '/assets/img/people/reich.jpg',
    paragraphs: [
      `Manuel konzeptioniert und programmiert
      Webseiten.`,
      `Konzepte und Design hat er gerne modern und radikal schlicht.
      Ziel ist es nur was wirklich gebraucht wird umsusetzen,
      und das mit größtmöglicher Perfektion.`,
      `Er studierte internationale Medieninformatik in Berlin.
      Davor arbeitete er, als Teil der Generation Praktikum, in Freiburg bei der Werkstatt für kreative Konzepte.`,
      `Bei der linkbird GmbH in Berlin war er Teil des SEO Teams. Und später entwickelte er viele, viele kleine und große Seiten für Common People Interactive in Barcelona.`,
      `Manuel genießt sein Lotterleben in Berlin. Lange Reden über sinnvolle und sinnfreie Dinge gehören zu seinen absoluten Lieblingsbeschäftigungen.
      Ab und zu kann man ihn in einem Hipster Cafe antreffen. Hier bestellt er seine Inspiration.`
    ]
  }
]

const throttle = function ({ func, delay }) {
  let block = false
  let timeoutId

  return function () {
    if (timeoutId) clearTimeout(timeoutId)

    if (block) {
      timeoutId = setTimeout(() => { func() }, delay)
    } else {
      block = true
      setTimeout(() => { block = false }, delay)
      func()
    }
  }
}

class CreativesPage extends React.Component {
  constructor (props) {
    super(props)

    this.sectionRefs = []
    this.state = {
      sectionImageStates: []
    }
  }

  setSectionImageStates () {
    const sectionImageStates = this.sectionRefs.map(el =>
      el.getBoundingClientRect().top - (window.innerHeight * 5 / 8) < 0
    )
    this.setState({ sectionImageStates })
  }

  componentDidMount () {
    this.setSectionImageStates()
    this.scrollHandler = throttle({ func: this.setSectionImageStates.bind(this), delay: 100 })
    window.addEventListener('scroll', this.scrollHandler)
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.scrollHandler)
  }

  render () {
    return (
      <article id='creatives-page'>
        { persons.map((person, index) => {
          const imgInView = index === 0 || this.state.sectionImageStates[index]
          const imgStateString = imgInView ? 'in-view' : 'out-of-view'

          return (
            <section className='creatives-section'
              key={ index }
              ref={ sectionRef => { this.sectionRefs[index] = sectionRef }}
            >
              <span className={ `creatives-image ${ imgStateString }` } style={{
                backgroundImage: `url(${ person.image })`
              }}/>
              <h2 className='creatives-section-title'>{ person.name }</h2>

              { person.paragraphs.map((paragraph, pIndex) =>
                <p key={ pIndex } className='creatives-paragraph'>{ paragraph }</p>
              )}
            </section>
          )
        })}
      </article>
    )
  }
}

export default CreativesPage
