import React, { PropTypes } from 'react'
import HighResImg from '../_helpers/highResImg'
import { Link } from 'react-router'

class StoriesPage extends React.Component {
  constructor (props, context) {
    super(props)

    if (context.initialDataLoader) {
      context.initialDataLoader.requestData([{
        key: 'stories',
        alwaysReload: true,
        url: `${process.env.HOST || window.location.origin}/assets/data/stories.json`
      }])
    }
  }
  render () {
    if (!this.props.stories) return null

    return (
      <ul id='storiesPage' className='inner-content'>
        { this.props.stories.map((storie, index) =>
          <li className='storie' key={index}>
            <Link to={storie.slug} className='storie-link'>
              <HighResImg className='storie-img' alt={storie.title} src={storie.cover} />
              <p className='storie-titel'>{ storie.title }</p>
            </Link>
          </li>
         )}
      </ul>
    )
  }
}

StoriesPage.propTypes = {
  stories: PropTypes.array
}

StoriesPage.contextTypes = {
  initialDataLoader: PropTypes.object
}

export default StoriesPage
