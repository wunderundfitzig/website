
import marked from 'marked'

const renderer = new marked.Renderer()

renderer.heading = function (text, level, raw) {
  level += 2
  return '<h' +
    level +
    ' id="' +
    this.options.headerPrefix +
    raw.toLowerCase().replace(/[^\w]+/g, '-') +
    '">' +
    text +
    '</h' +
    level +
    '>\n'
}

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

export default renderer
