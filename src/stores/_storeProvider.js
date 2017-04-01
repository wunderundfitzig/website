'use strict'
import React, { PropTypes } from 'react'

export class ServerRenderPreparer {
  constructor () {
    this.promises = []
  }

  register ({ promise }) { this.promises.push(promise) }

  awaitPromises () { return Promise.all(this.promises) }
}

export default class StoreProvider extends React.Component {
  getChildContext () {
    return {
      awaitBeforeServerRender: this.props.serverRenderPreparer ||
                               new ServerRenderPreparer(),
      store: this.props.store
    }
  }

  render () { return this.props.children }
}

StoreProvider.propTypes = {
  serverRenderPreparer: PropTypes.instanceOf(ServerRenderPreparer),
  store: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired
}
StoreProvider.childContextTypes = {
  awaitBeforeServerRender: PropTypes.object,
  store: PropTypes.func
}
