import React from 'react';
import PropTypes from 'prop-types';
import MarkdownIt from 'markdown-it';
// import mdiRegex from 'markdown-it-regexp';
import mdiSup from 'markdown-it-sup';

// const options = {
//   html: false,
//   xhtml: false,
//   breaks: false,
//   linkify: true,
//   // typographer: true,
// };

class Markdown extends React.Component {
  constructor(props) {
    super(props);
    this.md = new MarkdownIt('zero', {
      linkify: true,
    })
    .enable([
      'code',
      'emphasis',
      'entity',
      'image',
      'strikethrough',
      'escape',
      'backticks',
      'link',
      'blockquote',
      'list',
      'heading',
      'newline',
    ])
    .disable([
      ...this.props.disable,
    ])
    .use(mdiSup);
  }
  shouldComponentUpdate(nextProps) {
    return nextProps.source !== this.props.source;
  }
  render() {
    const { source } = this.props;
    let html;
    if (this.props.format === 'block') {
      html = this.md.render(source);
    } else if (this.props.format === 'inline') {
      html = this.md.renderInline(source);
    }
    return <span className="markdown-body" dangerouslySetInnerHTML={{ __html: html }} />;
  }
}

Markdown.propTypes = {
  source: PropTypes.string.isRequired,
  format: PropTypes.string,
  disable: PropTypes.array,
};

Markdown.defaultProps = {
  format: 'block',
  disable: [],
};

module.exports = Markdown;
