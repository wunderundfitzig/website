import React, { PropTypes } from 'react'
import HighResImg from '../_helpers/highResImg'
import { Link } from 'react-router'

const StoriesOverview = ({ stories }) => (
  <ul className='stories-overview'>
    {stories.map((storie, index) =>
      <li className='storie' key={index}>
        <Link to={storie.slug} className='storie-link'>
          <HighResImg className='storie-img' alt={storie.title} src={storie.cover} />
          <p className='storie-titel'>{ storie.title }</p>
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
