import React from 'react'
import SyntaxHighlighter, { registerLanguage } from 'react-syntax-highlighter/dist/light'
import markdown from 'highlight.js/lib/languages/markdown'
import marked from 'marked'
import highlightStyle from './syntaxStyles'

registerLanguage('markdown', markdown)
const renderer = new marked.Renderer()
// override markdown link render method
// to add target="_blank" to links
renderer.link = function (href, title, text) {
  if (this.options.sanitize) {
    try {
      var prot = decodeURIComponent(unescape(href)).replace(/[^\w:]/g, '').toLowerCase()
    } catch (e) { return '' }
    if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0) return ''
  }
  var out = '<a href="' + href + '" target="_blank"'
  if (title) out += ' title="' + title + '"'
  out += '>' + text + '</a>'
  return out
}

export default class ComponentDemo extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      initialMarkdown: props.markdown,
      markdown: props.markdown
    }
  }

  render () {
    const { editMode, onChange, className } = this.props
    const { initialMarkdown, markdown } = this.state

    if (!editMode) {
      return (
        <div id='markdown-editor' className={className} dangerouslySetInnerHTML={{ __html: marked(markdown, {
          renderer: renderer,
          sanitize: true
        })}} />
      )
    }

    return (
      <div id='markdown-editor' className='editMode'>
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
