import React from 'react';
import PropTypes from 'prop-types';
import MarkdownIt from 'markdown-it';
// import mdiRegex from 'markdown-it-regexp';
import mdiSup from 'markdown-it-sup';
import twitter from 'twitter-text';
import classNames from 'classnames';
import linkify from 'linkify-it';

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
      breaks: false,
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
      'linkify',
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
    // console.log(twitter.autoLink(source));
    return (
      <span
        // className={classNames('markdown-body', this.props.className)}
        className={classNames('markdown-body', this.props.className, {
          inline: this.props.format === 'inline',
        })}
        dangerouslySetInnerHTML={{ __html: twitter.autoLink(html) }}
      />
    );
  }
}

Markdown.propTypes = {
  source: PropTypes.string,
  format: PropTypes.string,
  disable: PropTypes.array,
  className: PropTypes.string,
};

Markdown.defaultProps = {
  source: '',
  format: 'block',
  disable: [],
  className: '',
};

module.exports = Markdown;
