import React from 'react'
import SyntaxHighlighter, { registerLanguage } from 'react-syntax-highlighter/dist/light'
import markdownLang from 'highlight.js/lib/languages/markdown'
import marked from 'marked'
import highlightStyle from './syntaxStyles'

registerLanguage('markdown', markdownLang)
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
    this.i = 0
    this.caretOffset = null
  }

  componentDidUpdate () {
    if (!this.props.editMode) return

    const removeCommentsFrom = node => {
      const commentNodes = []
      for (const childNode of node.childNodes) {
        if (childNode.nodeType > 3) {
          commentNodes.push(childNode) // comment or other strange node
        } else if (childNode.hasChildNodes()) {
          removeCommentsFrom(childNode)
        }
      }
      for (const commentNode of commentNodes) node.removeChild(commentNode)
    }
    removeCommentsFrom(this.editorRef)

    if (this.caretOffset === null) return
    // find the node in which we need to start the selection
    // for the provided offset
    const findSelectionStartInNode = (node, offset) => {
      for (const childNode of node.childNodes) {
        if (childNode.textContent.length > offset) {
          return childNode.hasChildNodes()
            ? findSelectionStartInNode(childNode, offset)
            : { node: childNode, offset }
        } else {
          offset -= childNode.textContent.length
        }
      }
    }

    const { node, offset } = findSelectionStartInNode(this.editorRef, this.caretOffset)
    const selection = window.getSelection()
    const range = document.createRange()
    range.setStart(node, offset)
    range.setEnd(node, offset)
    selection.removeAllRanges()
    selection.addRange(range)
    this.editorRef.focus()
    this.caretOffset = null
  }

  getCaretOffset () {
    const range = window.getSelection().getRangeAt(0)
    const preCaretRange = range.cloneRange()
    preCaretRange.selectNodeContents(this.editorRef)
    preCaretRange.setEnd(range.endContainer, range.endOffset)

    const getTextLength = (node) => {
      let length = 0
      for (const childNode of node.childNodes) {
        if (childNode.nodeType > 3) continue // ignore comments
        if (childNode.hasChildNodes()) {
          length += getTextLength(childNode)
        } else {
          const isBr = childNode.nodeName.toLowerCase() === 'br'
          length += isBr ? 1 : childNode.textContent.length
        }
      }
      return length
    }
    return getTextLength(preCaretRange.cloneContents())
  }

  render () {
    const { markdown, editMode, onChange, className } = this.props

    if (!editMode) {
      return (
        <div id='markdown-editor' className={className}
          dangerouslySetInnerHTML={{ __html: marked(markdown, {
            renderer: renderer,
            sanitize: true,
            gfm: false,
            smartypants: true
          })}}
        />
      )
    }

    return (
      <div>
        <div id='markdown-editor' className='editMode'
          key={++this.i}
          ref={ref => { this.editorRef = ref }}
          contentEditable
          suppressContentEditableWarning
          onInput={e => {
            this.caretOffset = this.getCaretOffset()
            onChange(e.target.innerText)
          }}
        >
          <SyntaxHighlighter className='editor'
            language='markdown'
            style={highlightStyle}
            codeTagProps={{ className: 'code' }}
          >
            { markdown }
          </SyntaxHighlighter>
        </div>
      </div>
    )
  }
}
