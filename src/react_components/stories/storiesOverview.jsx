'use strict'

import React, { PropTypes } from 'react'
import StoryCover from './storyCover'

class StoriesOverview extends React.Component {
  constructor (props) {
    super(props)
    this.storiesContainerRef = null
    this.storyRefs = []
    this.state = {
      storyPositions: null,
      draggedStoryIndex: null,
      storyOrderNumbers: null
    }
  }

  setupDrag (e, draggedStoryIndex) {
    if (!this.props.editMode) {
      e.preventDefault()
      return
    }

    const storyPositions = this.storyRefs.filter(ref => ref !== null)
    .map(ref => ({ top: ref.offsetTop, left: ref.offsetLeft }))

    const storyContainerSize = {
      x: this.storiesContainerRef.offsetLeft,
      y: this.storiesContainerRef.offsetTop + this.storiesContainerRef.offsetParent.offsetTop,
      width: this.storiesContainerRef.clientWidth,
      height: this.storiesContainerRef.clientHeight
    }

    // safari wont let us drag if we update the state
    // in here so we need setTimeout
    setTimeout(() => {
      this.setState({
        dragPhase: 0,
        draggedStoryIndex,
        storyPositions,
        storyContainerSize,
        storyOrderNumbers: this.props.stories.map((_, index) => index),
        numberOfCols: Math.round(storyContainerSize.width / this.storyRefs[0].clientWidth),
        numberOfRows: Math.round(storyContainerSize.height / this.storyRefs[0].clientHeight)
      })
    }, 0)
  }

  handleDrag (e) {
    if (this.state.draggedStoryIndex === null) return

    const x = e.pageX - this.state.storyContainerSize.x
    const y = e.pageY - this.state.storyContainerSize.y

    const col = Math.floor(x / this.state.storyContainerSize.width * this.state.numberOfCols)
    const row = Math.floor(y / this.state.storyContainerSize.height * this.state.numberOfRows)
    const pos = row * this.state.numberOfCols + col

    if (pos === this.lastPos) return

    this.lastPos = pos
    const positions = this.props.stories.map((_, index) => index)
    positions.splice(this.state.draggedStoryIndex, 1)
    positions.splice(pos, 0, this.state.draggedStoryIndex)
    const storyOrderNumbers = this.props.stories.map((_, position) => positions.indexOf(position))

    this.setState({ dragPhase: 1, storyOrderNumbers })
  }

  cleanupDrag () {
    const stories = this.props.stories.reduce((newStories, story, index) => {
      const newPosition = this.state.storyOrderNumbers[index]
      newStories[newPosition] = story
      return newStories
    }, [])

    this.context.store.setState({ stories })
    this.setState({
      dragPhase: null,
      draggedStoryIndex: null,
      storyOrderNumbers: this.props.stories.map((_, index) => index)
    })
  }

  render () {
    const { editMode, stories } = this.props
    const {
      dragPhase,
      draggedStoryIndex,
      storyContainerSize,
      storyPositions,
      storyOrderNumbers
    } = this.state
    const isDragging = draggedStoryIndex !== null

    return (
      <ul id='storiesOverview'
        ref={storiesContainer => { this.storiesContainerRef = storiesContainer }}
        style={{ height: isDragging ? storyContainerSize.height : 'auto' }}
        onDragOver={e => this.handleDrag(e)}
      >
        {stories.map((story, index) => {
          const style = isDragging ? {
            position: 'absolute',
            top: storyPositions[storyOrderNumbers[index]].top,
            left: storyPositions[storyOrderNumbers[index]].left,
            opacity: draggedStoryIndex === index ? 0 : 1,
            // make shure to animate positions after positions are set to absolute
            transition: dragPhase > 0 ? 'top 0.3s, left 0.3s' : ''
          } : {}

          return (
            <li className='story'
              ref={li => { this.storyRefs[index] = li }}
              key={story.slug}
              draggable={editMode}
              style={style}
              onDragStart={e => { this.setupDrag(e, index) }}
              onDragEnd={() => { this.cleanupDrag() }}
            >
              <StoryCover
                title={story.title}
                slug={story.slug}
                image={story.cover}
                editMode={editMode}
                stories={stories}
              />
            </li>
          )
        })}
        { (editMode && !isDragging) &&
          <li className='new-story'
            onDragStart={e => { e.preventDefault() }}
            onClick={this.context.store.addStory}
          >
            <a className='new-story-inner' />
          </li>
        }
      </ul>
    )
  }
}

StoriesOverview.propTypes = {
  stories: PropTypes.array.isRequired,
  editMode: PropTypes.bool
}

StoriesOverview.contextTypes = {
  store: PropTypes.func,
  initialDataLoader: PropTypes.object
}

export default StoriesOverview
