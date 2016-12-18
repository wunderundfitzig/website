import React, { PropTypes } from 'react'
import HighResImg from '../_helpers/highResImg'
import { Link } from 'react-router'

const StoriesOverview = ({ stories }) => (
  <ul id='storiesOverview'>
    {stories.map((story, index) =>
      <li className='story' key={index}>
        <Link to={`${story.slug}/0`} className='story-link'>
          <span className='story-image-wrapper'>
            <HighResImg className='story-img' alt={story.title} src={story.cover} />
          </span>
          <p className='story-titel'>{ story.title }</p>
        </Link>
      </li>
     )}
  </ul>
)

StoriesOverview.propTypes = {
  stories: PropTypes.array.isRequired
}

StoriesOverview.contextTypes = {
  initialDataLoader: PropTypes.object
}

export default StoriesOverview
