import React, { PropTypes } from 'react'
import HighResImg from '../_helpers/highResImg'
import { Link } from 'react-router'

const StoriesOverview = ({ stories }) => (
  <ul id='storiesOverview'>
    {stories.map((story, index) =>
      <li className='story' key={index}>
        <Link to={story.slug} className='story-link'>
          <HighResImg className='story-img' alt={story.title} src={story.cover} />
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
