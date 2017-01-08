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
    const wrapStyle = {
      position: 'relative',
      border: '1px solid #eee',
      backgroundColor: 'white',
      borderRadius: '2px',
      margin: '-6px -9px'
    }
    const preStyle = {
      position: 'absolute',
      width: '100%',
      whiteSpace: 'pre-wrap',
      wordWrap: 'break-word',
      backgroundColor: 'transparent',
      margin: 0,
      padding: '5px 8px'
    }
    const codeStyle = {
      fontFamily: '"Noto Serif", serif',
      lineHeight: '1.7em',
      fontWeight: 'normal',
      fontStyle: 'normal'
    }

    return (
      <div style={wrapStyle}>
        <pre style={preStyle}
          contentEditable
          onInput={e => {
            this.setState({ markdown: e.target.innerText })
            onChange(e.target.innerText)
          }}
        >
          { /* initialMarkdown does not change with new props
            so react won't update this component and the cursor will stay in tact */ }
          <code style={codeStyle}>{ initialMarkdown }</code>
        </pre>
        <SyntaxHighlighter
          language='markdown'
          style={highlightStyle}
          customStyle={{
            ...preStyle,
            position: 'relative',
            zIndex: 10,
            pointerEvents: 'none'
          }}
          codeTagProps={{ style: codeStyle }}
        >
          { markdown }
        </SyntaxHighlighter>
      </div>
    )
  }
}
