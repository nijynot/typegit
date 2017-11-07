import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import get from 'lodash/get';

import ClickOutsideListener from './ClickOutsideListener.js';
import Markdown from './Markdown.js';

class MarkdownEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: this.props.value || '',
      focus: false,
      preview: false,
      help: false,
    };
    this.onChange = this.onChange.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }
  onChange(e) {
    this.props.onChange({ e, value: e.target.value });
    this.setState({
      [e.target.name]: e.target.value,
    });
  }
  onClick(e) {
    const { name } = e.target;
    this.setState({
      [name]: !get(this.state, name),
    });
  }
  onFocus() {
    this.setState({
      focus: true,
    });
  }
  onBlur() {
    if (this.state.comment === '' && !this.state.preview) {
      this.setState({
        focus: false,
      });
    }
  }
  render() {
    return (
      <ClickOutsideListener
        onClickOutside={this.onBlur}
      >
        <div
          className={classNames('markdowneditor', {
            active: this.state.focus,
            blurred: !this.state.focus,
          })}
          onFocus={this.onFocus}
        >
          {(this.state.preview)
            ? <div>
              <div className="markdowneditor-preview-flash">
                Previewing your comment...
              </div>
              <div className="markdowneditor-preview markdown-body">
                <Markdown
                  source={this.state.comment}
                  disable={[
                    'heading',
                    'hr',
                    'image',
                  ]}
                  // state="inline"
                />
              </div>
            </div> : <textarea
              name="comment"
              className="markdowneditor-textarea"
              rows="4"
              value={this.state.comment}
              onChange={this.onChange}
            />}
          <div className="markdowneditor-actions">
            <button
              name="help"
              className={classNames('markdowneditor-action', {
                active: this.state.help,
              })}
              onClick={this.onClick}
            >
              Markdown help
            </button>
            <button
              name="preview"
              className={classNames('markdowneditor-action right', {
                active: this.state.preview,
              })}
              onClick={this.onClick}
            >
              {(!this.state.preview)
                ? 'Preview comment'
                : 'Stop preview' }
            </button>
          </div>
        </div>
        {(this.state.help)
          ? <div className="markdowneditor-help">
            <button
              name="help"
              className="markdowneditor-close-help-button"
              onClick={this.onClick}
            >
              close
            </button>
            <div className="markdown-body">
              <div className="markdowneditor-help-row">
                *italics* → <Markdown state="inline" source="*italics*" />
              </div>
              <div className="markdowneditor-help-row">
                **bold** → <Markdown state="inline" source="**bold**" />
              </div>
              <div className="markdowneditor-help-row">
                [i like animu](https://google.com) → <Markdown state="inline" source="[i like animu](https://google.com)" />
              </div>
              <div className="markdowneditor-help-row">
                `console.log();` (three back-ticks for block) → <Markdown state="inline" source="`console.log();`" />
              </div>
              <div className="markdowneditor-help-row">
                &gt; motivational quote →{' '}
                <span className="markdowneditor-inline-blockquote">
                  <Markdown state="block" source={'> motivational quote '} />
                </span>
              </div>
              <div className="markdowneditor-help-row">
                super^script^ → <Markdown state="inline" source="super^script^" />
              </div>
            </div>
          </div> : null}
      </ClickOutsideListener>
    );
  }
}

MarkdownEditor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

module.exports = MarkdownEditor;
