import React, { PropTypes } from 'react'
import SyntaxHighlighter, { registerLanguage }
  from 'react-syntax-highlighter/dist/light'
import markdownLang from 'highlight.js/lib/languages/markdown'
import marked from 'marked'
import renderer from '../_lib/markdownRenderer'

registerLanguage('markdown', markdownLang)

export default class MarkdownEditor extends React.Component {
  static propTypes = {
    markdown: PropTypes.string,
    editMode: PropTypes.bool,
    className: PropTypes.string,
    onChange: PropTypes.func
  }

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
        if (childNode.nodeType > 3) { // comment or other strange node
          commentNodes.push(childNode)
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
        if (childNode.textContent.length >= offset) {
          return childNode.hasChildNodes()
            ? findSelectionStartInNode(childNode, offset)
            : { node: childNode, offset }
        } else {
          offset -= childNode.textContent.length
        }
      }
    }

    const { node, offset } =
      findSelectionStartInNode(this.editorRef, this.caretOffset)

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
        <div id='markdown-editor' className={`${className} editMode`}
          key={++this.i}
          ref={ref => { this.editorRef = ref }}
          contentEditable
          suppressContentEditableWarning
          onInput={e => {
            this.caretOffset = this.getCaretOffset()
            onChange(e.target.innerText)
          }}
        >
          <SyntaxHighlighter
            language='markdown'
            useInlineStyles={false}
            codeTagProps={{ className: 'code' }}
          >
            { markdown }
          </SyntaxHighlighter>
        </div>
      </div>
    )
  }
}
