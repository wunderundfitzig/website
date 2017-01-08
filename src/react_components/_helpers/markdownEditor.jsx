import React from 'react'
import SyntaxHighlighter, { registerLanguage } from 'react-syntax-highlighter/dist/light'
import markdown from 'highlight.js/lib/languages/markdown'
import highlightStyle from './syntaxStyles'

registerLanguage('markdown', markdown)

export default class ComponentDemo extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      initialMarkdown: props.markdown,
      markdown: props.markdown
    }
  }

  render () {
    const { onChange } = this.props
    const { initialMarkdown, markdown } = this.state

    return (
      <div id='markdown-editor'>
        <pre className='editor'
          contentEditable
          onInput={e => {
            this.setState({ markdown: e.target.innerText })
            onChange(e.target.innerText)
          }}
        >
          { /* initialMarkdown does not change with new props
            so react won't update this component and the cursor will stay in tact */ }
          <code className='code'>{ initialMarkdown }</code>
        </pre>
        <SyntaxHighlighter className='editor'
          language='markdown'
          style={highlightStyle}
          customStyle={{
            position: 'relative',
            zIndex: 10,
            pointerEvents: 'none'
          }}
          codeTagProps={{ className: 'code' }}
        >
          { markdown }
        </SyntaxHighlighter>
      </div>
    )
  }
}
