import React, { PropTypes } from 'react'
import HighResImg from '../_helpers/highResImg'
import { Link } from 'react-router'

class StoriesOverview extends React.Component {
  constructor (props) {
    super(props)
    this.storiesContainerRef = null
    this.storyRefs = []
    this.dragedStoryIndex = null
    this.state = {
      storyPositions: [],
      storyOrderNumbers: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      storyContainerSize: { x: null, y: null, height: null }
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.editMode || !nextProps.editMode) return

    const storyPositions = []
    for (const i in this.storyRefs) {
      const ref = this.storyRefs[i]
      storyPositions[i] = { top: ref.offsetTop, left: ref.offsetLeft }
    }

    this.setState({
      storyPositions,
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

    const newOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8]
    newOrder.splice(this.dragedStoryIndex, 1)
    newOrder.splice(pos, 0, this.dragedStoryIndex)
    this.setState({ storyOrderNumbers: [0, 1, 2, 3, 4, 5, 6, 7, 8].map(o => newOrder.indexOf(o)) })
  }

  render () {
    const { editMode } = this.props

    return (
      <ul id='storiesOverview'
        ref={storiesContainer => { this.storiesContainerRef = storiesContainer }}
        style={{ height: editMode && this.state.storyContainerSize.height }}
        onDragOver={e => this.handleDrag(e)}
      >
        {this.props.stories.map((story, index) => {
          const i = this.state.storyOrderNumbers[index]
          const pos = this.state.storyPositions[i]

          return (
            <li draggable={editMode} className={`story ${editMode && 'editMode'}`}
              ref={story => { this.storyRefs[index] = story }}
              key={story.slug}
              style={{
                top: editMode && pos.top,
                left: editMode && pos.left
              }}
              onDragStart={() => { this.dragedStoryIndex = index }}
              onDragEnd={e => {
                // this.content.store.resortStories()
                // TODO: this is very ugly
                // move this into the store
                this.props.stories.map((story, i) => {
                  story.order = this.state.storyOrderNumbers[i]
                  return story
                })
                this.props.stories.sort((a, b) => a.order > b.order)
                this.setState({ storyOrderNumbers: [0, 1, 2, 3, 4, 5, 6, 7, 8] })
              }}
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
  initialDataLoader: PropTypes.object
}

export default StoriesOverview
