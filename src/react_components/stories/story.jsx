/* global FileReader */
'use strict'

import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import Editable from '../_lib/editable'
import MarkdownEditor from '../_lib/markdownEditor'

export default class Story extends React.Component {
  static propTypes = {
    parentPathname: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    storyPage: PropTypes.object.isRequired,
    pageNumber: PropTypes.number.isRequired,
    numberOfPages: PropTypes.number.isRequired,
    editMode: PropTypes.bool
  }

  static contextTypes = {
    store: PropTypes.func,
    router: PropTypes.object
  }

  setPageTitle = (title) => {
    this.context.store.stories.setPageTitle({
      slug: this.props.slug,
      pageNumber: this.props.pageNumber,
      title: title
    })
  }

  setPageImage = (e) => {
    e.preventDefault()
    const fileReader = new FileReader()
    const fileHandler = e => {
      this.context.store.stories.setPageImage({
        slug: this.props.slug,
        pageNumber: this.props.pageNumber,
        image: e.target.result
      })
      fileReader.removeEventListener('load', fileHandler)
    }
    fileReader.addEventListener('load', fileHandler)
    fileReader.readAsDataURL(e.target.files[0])
  }

  increasePageNumber = () => {
    const newPageNumber = this.props.pageNumber + 1
    this.setPageNumber({ to: newPageNumber })
  }

  decreasePageNumber = () => {
    const newPageNumber = this.props.pageNumber - 1
    this.setPageNumberTo(newPageNumber)
  }

  setPageNumberTo = (newPageNumber) => {
    this.context.store.stories.setPageNumber({
      slug: this.props.slug,
      pageNumber: this.props.pageNumber,
      newPageNumber: newPageNumber
    })
    this.context.router.transitionTo(`${newPageNumber + 1}`)
  }

  createPage = () => {
    const newPageNumber = this.props.pageNumber + 1
    this.context.store.stories.createPage({
      slug: this.props.slug,
      newPageNumber: newPageNumber
    })
    this.context.router.transitionTo(`${newPageNumber + 1}`)
  }

  deletePage = () => {
    this.context.store.stories.deletePage({
      slug: this.props.slug,
      pageNumber: this.props.pageNumber
    })
  }

  render () {
    const {
      parentPathname,
      slug,
      storyPage,
      pageNumber,
      numberOfPages,
      editMode
    } = this.props
    const { store } = this.context
    const isFirstPage = pageNumber === 0
    const isLastPage = pageNumber === numberOfPages - 1

    return (
      <div id='story'>
        <Editable editMode={editMode} onChange={this.setPageTitle}>
          <h2 className='story-title'>{ storyPage.title }</h2>
        </Editable>
        <Link className={`close-button ${editMode && 'editMode'}`}
          to={parentPathname}>✕</Link>
        <div className='story-image' style={{
          backgroundImage: `url(${storyPage.image})`,
          ...storyPage.imageStyles
        }}>
          { editMode &&
            <div className='edit-panel'>
              { numberOfPages > 1 &&
                <button className='delete-page-button'
                  onClick={this.deletePage}
                >
                  Seite { pageNumber + 1 } löschen
                </button>
              }
              <input id={`img-selector${slug}`}
                className='file-selector'
                type='file'
                accept='image/*'
                onChange={this.setPageImage}
              />
              <label className='edit-image-button'
                htmlFor={`img-selector${slug}`}
              >
                Bild auswählen
              </label>
              <button className='create-page-button'
                onClick={this.createPage}
              >
                Neue Seite erstellen
              </button>
            </div>
          }
        </div>
        { !isFirstPage &&
          <Link className='prev arrow' to={`${pageNumber}`}>←</Link>
        }
        { !isLastPage &&
          <Link className={`next arrow ${editMode && 'editMode'}`}
            to={`${pageNumber + 2}`}>→</Link>
        }
        <MarkdownEditor className='story-text'
          editMode={editMode}
          markdown={storyPage.markdown}
          onChange={markdown => {
            store.stories.setPageMarkdown({ slug, pageNumber, markdown })
          }}
        />

        { (editMode && numberOfPages > 1) &&
          <div className='page-number-panel'>
            Seite:
            <button className='page-number-button'
              disabled={isFirstPage}
              onClick={this.decreasePageNumber}
            >-</button>
            <span className='page-number'>{ pageNumber + 1 }</span>
             / { numberOfPages }
            <button className='page-number-button'
              disabled={isLastPage}
              onClick={this.increasePageNumber}
            >+</button>
          </div>
        }
      </div>
    )
  }
}
