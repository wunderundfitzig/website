import React, { PropTypes } from 'react'
import HighResImg from '../_helpers/highResImg'
import { Link } from 'react-router'

class StoriesOverview extends React.Component {
  constructor (props) {
    super(props)
    this.storiesContainerRef = null
    this.storyRefs = []
    this.state = {
      dragedStoryIndex: null,
      storyOrderNumbers: this.props.stories.map((_, index) => index)
    }
  }

  setupDrag (dragedStoryIndex) {
    if (!this.props.editMode) return

    const storyPositions = []
    for (const i in this.storyRefs) {
      const ref = this.storyRefs[i]
      storyPositions[i] = { top: ref.offsetTop, left: ref.offsetLeft }
    }

    this.setState({
      storyPositions,
      dragedStoryIndex,
      storyContainerSize: {
        x: this.storiesContainerRef.offsetLeft,
        y: this.storiesContainerRef.offsetTop + this.storiesContainerRef.offsetParent.offsetTop,
        width: this.storiesContainerRef.clientWidth,
        height: this.storiesContainerRef.clientHeight
      },
      numberOfCols: 3,
      numberOfRows: 3
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
      const t = positions.splice(this.state.dragedStoryIndex, 1)
      positions.splice(pos, 0, t[0])
      const storyOrderNumbers = this.props.stories.map((_, position) => positions.indexOf(position))

      this.setState({ storyOrderNumbers })
    }
  }

  cleanupDrag () {
    const stories = []
    this.props.stories.forEach((story, index) => {
      const newPosition = this.state.storyOrderNumbers[index]
      stories[newPosition] = story
    })
    this.context.store.setState({ stories })
    this.setState({
      dragedStoryIndex: null,
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
          if (this.state.dragedStoryIndex !== null) {
            const pos = this.state.storyPositions[this.state.storyOrderNumbers[index]]
            style = {
              position: 'absolute',
              top: pos.top,
              left: pos.left
              // opacity: this.state.dragedStoryIndex === index ? 0 : 1
            }
          }

          return (
            <li className='story'
              ref={li => { this.storyRefs[index] = li }}
              key={story.slug}
              draggable={editMode}
              style={style}
              onDragStart={() => { this.setupDrag(index) }}
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
