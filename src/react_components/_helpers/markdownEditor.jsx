import React from 'react'
import SyntaxHighlighter, { registerLanguage } from 'react-syntax-highlighter/dist/light'
import markdown from 'react-syntax-highlighter/node_modules/highlight.js/lib/languages/markdown'
import highlightStyle from 'react-syntax-highlighter/dist/styles/ascetic'

registerLanguage('markdown', markdown)

export default class ComponentDemo extends React.Component {

  shouldComponentUpdate () {
    return false
  }

  render () {
    const { onChange, markdown } = this.props

    return (
      <div contentEditable
        onInput={e => { onChange(e.target.innerText) }}
        onBlur={e => { onChange(e.target.innerText) }}
      >
        <SyntaxHighlighter
          language='markdown'
          style={highlightStyle}
          customStyle={{
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            border: '1px solid #eee',
            borderRadius: '2px',
            padding: '5px 8px',
            margin: '-6px -9px'
          }}
          codeTagProps={{ style: {
            fontFamily: '"Noto Serif", serif',
            lineHeight: '1.7em'
          } }}
        >
          { markdown }
        </SyntaxHighlighter>
      </div>
    )
  }
}
