'use strict'

import React, { PropTypes } from 'react'

class SlugEditor extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      slug: props.slug,
      editing: false,
      isValid: true
    }
  }

  validateSlug (slug) {
    let isValid = slug.search(/[^a-z0-9-]/) === -1

    if (isValid) {
      const found = this.props.stories.find(story => story.slug === slug)
      isValid = found === undefined || found.slug === this.props.slug
    }
    this.setState({ slug, isValid })
  }

  submit () {
    this.context.store.setStorySlug({ slug: this.props.slug, newSlug: this.state.slug })
    this.setState({ editing: false })
  }

  render () {
    const { slug, editing, isValid } = this.state

    if (!editing) {
      return (
        <button className='edit-slug-button' onClick={() => {
          this.setState({ editing: true })
        }}>
          slug bearbeiten
        </button>
      )
    }

    return (
      <form className='slug-editor'>
        <input className='slug-input'
          type='text'
          value={slug}
          onChange={e => { this.validateSlug(e.target.value) }}
        />
        <button className='sumbit-slug-button'
          type='submit'
          disabled={!isValid}
          onClick={() => { this.submit() }}
        >
          ok
        </button>
      </form>
    )
  }
}

SlugEditor.propTypes = {
  slug: PropTypes.string.isRequired,
  stories: PropTypes.array.isRequired
}

SlugEditor.contextTypes = {
  store: PropTypes.func
}

export default SlugEditor