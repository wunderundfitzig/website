/* global createStyles */
'use-strict'

import React from 'react'
import SyntaxHighlighter, { registerLanguage } from 'react-syntax-highlighter/dist/light'
import markdown from 'react-syntax-highlighter/node_modules/highlight.js/lib/languages/markdown'
import highlightStyle from './syntaxStyles'

registerLanguage('markdown', markdown)

export default class MarkdownEditor extends React.Component {
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
      <div className={styles.editor}>
        <pre className={styles.editorInner}
          contentEditable
          onInput={e => {
            this.setState({ markdown: e.target.innerText })
            onChange(e.target.innerText)
          }}
        >
          { /* initialMarkdown does not change with new props
            so react won't update this component and the cursor will stay in tact */ }
          <code className={styles.code}>{ initialMarkdown }</code>
        </pre>
        <SyntaxHighlighter className={styles.editorInner}
          language='markdown'
          style={highlightStyle}
          customStyle={{
            position: 'relative',
            zIndex: 10,
            pointerEvents: 'none'
          }}
          codeTagProps={{ className: styles.code }}
        >
          { markdown }
        </SyntaxHighlighter>
      </div>
    )
  }
}

const styles = createStyles({
  editor: {
    position: 'relative',
    border: '1px solid #eee',
    backgroundColor: 'white',
    borderRadius: '2px',
    margin: '-6px -9px'
  },
  editorInner: {
    position: 'absolute',
    width: '100%',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    backgroundColor: 'transparent',
    margin: 0,
    padding: '5px 8px'
  },
  code: {
    fontFamily: '"Noto Serif", serif',
    lineHeight: '1.7em',
    fontWeight: 'normal',
    fontStyle: 'normal'
  }
})
