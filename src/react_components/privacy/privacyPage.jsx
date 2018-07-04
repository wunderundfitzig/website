'use strict'

import React, { PropTypes } from 'react'
import MarkdownEditor from '../_lib/markdownEditor'
import fetch from 'node-fetch'

export default class PrivacyPage extends React.Component {
  static propTypes = {
    privacyInfo: PropTypes.object,
    editMode: PropTypes.bool
  }
  static contextTypes = {
    awaitBeforeServerRender: PropTypes.object,
    store: PropTypes.func
  }

  constructor (props, context) {
    super(props)
    if (props.privacyInfo.markdown !== '') return

    context.awaitBeforeServerRender.register({
      promise: fetch(`${process.env.HOST || window.location.origin}/api/privacyInfo`)
      .then(res => res.json())
      .then(privacyInfo => context.store.privacyInfo.setMarkdown(privacyInfo.markdown))
    })
  }

  render () {
    const { editMode, privacyInfo } = this.props
    const { store } = this.context
    return (
      <div id='privacy-page'>
        <div className='inner-content'>
          <MarkdownEditor className='creatives-text'
            editMode={editMode}
            markdown={privacyInfo.markdown}
            onChange={markdown => {
              store.privacyInfo.setMarkdown(markdown)
            }} />
        </div>
      </div>
    )
  }
}
