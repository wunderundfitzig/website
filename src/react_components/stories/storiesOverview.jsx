import React, { PropTypes } from 'react'
import HighResImg from '../_helpers/highResImg'
import { Link } from 'react-router'

class StoriesOverview extends React.Component {
  constructor (props) {
    super(props)
    this.storiesContainerRef = null
    this.storyRefs = []
    this.state = {
      draggedStoryIndex: null,
      storyOrderNumbers: this.props.stories.map((_, index) => index)
    }
  }

  setupDrag (e, draggedStoryIndex) {
    if (!this.props.editMode) {
      e.preventDefault()
      return
    }

    const storyPositions = []
    for (const i in this.storyRefs) {
      const ref = this.storyRefs[i]
      storyPositions[i] = { top: ref.offsetTop, left: ref.offsetLeft }
    }

    const storyContainerSize = {
      x: this.storiesContainerRef.offsetLeft,
      y: this.storiesContainerRef.offsetTop + this.storiesContainerRef.offsetParent.offsetTop,
      width: this.storiesContainerRef.clientWidth,
      height: this.storiesContainerRef.clientHeight
    }

    this.setState({
      storyPositions,
      draggedStoryIndex,
      storyContainerSize,
      numberOfCols: Math.round(storyContainerSize.width / this.storyRefs[0].clientWidth),
      numberOfRows: Math.round(storyContainerSize.height / this.storyRefs[0].clientHeight)
    })
  }

  handleDrag (e) {
    if (!this.props.editMode) return

    const x = e.pageX - this.state.storyContainerSize.x
    const y = e.pageY - this.state.storyContainerSize.y

    const col = Math.floor(x / this.state.storyContainerSize.width * this.state.numberOfCols)
    const row = Math.floor(y / this.state.storyContainerSize.height * this.state.numberOfRows)
    const pos = row * this.state.numberOfCols + col

    if (pos !== this.lastPos) {
      this.lastPos = pos
      const positions = this.props.stories.map((_, index) => index)
      positions.splice(this.state.draggedStoryIndex, 1)
      positions.splice(pos, 0, this.state.draggedStoryIndex)
      const storyOrderNumbers = this.props.stories.map((_, position) => positions.indexOf(position))

      this.setState({ storyOrderNumbers })
    }
  }

  cleanupDrag () {
    const stories = this.props.stories.reduce((newStories, story, index) => {
      const newPosition = this.state.storyOrderNumbers[index]
      newStories[newPosition] = story
      return newStories
    }, [])
    this.context.store.setState({ stories })
    this.setState({
      draggedStoryIndex: null,
      storyOrderNumbers: this.props.stories.map((_, index) => index)
    })
  }

  render () {
    const { editMode } = this.props

    return (
      <ul id='storiesOverview'
        ref={storiesContainer => { this.storiesContainerRef = storiesContainer }}
        style={{ height: this.state.storyContainerSize && this.state.storyContainerSize.height }}
        onDragOver={e => this.handleDrag(e)}
      >
        {this.props.stories.map((story, index) => {
          let style = {}
          if (this.state.draggedStoryIndex !== null) {
            const pos = this.state.storyPositions[this.state.storyOrderNumbers[index]]
            style = {
              position: 'absolute',
              top: pos.top,
              left: pos.left,
              opacity: this.state.draggedStoryIndex === index ? 0 : 1
            }
          }

          return (
            <li className='story'
              ref={li => { this.storyRefs[index] = li }}
              key={story.slug}
              draggable={editMode}
              style={style}
              onDragStart={e => { this.setupDrag(e, index) }}
              onDragEnd={() => { this.cleanupDrag() }}
            >
              <Link to={`${story.slug}/0`} className='story-link'>
                <span className='story-image-wrapper'>
                  <HighResImg className='story-img' alt={story.title} src={story.cover} />
                </span>
                <p className='story-titel'>{ story.title }</p>
              </Link>
            </li>
          )
        })}
      </ul>
    )
  }
}

StoriesOverview.propTypes = {
  stories: PropTypes.array.isRequired
}

StoriesOverview.contextTypes = {
  store: PropTypes.func,
  initialDataLoader: PropTypes.object
}

export default StoriesOverview
