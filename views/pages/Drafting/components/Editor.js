import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Textarea from 'react-textarea-autosize';
import autosize from 'autosize';

import Markdown from 'global-components/Markdown.js';
import ClickOutsideListener from 'global-components/ClickOutsideListener.js';

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // body: this.props.value,
      preview: false,
      help: false,
      showActions: false,
    };
    this.onChange = this.onChange.bind(this);
    this.toggleHelp = this.toggleHelp.bind(this);
    this.togglePreview = this.togglePreview.bind(this);
    this.hideActions = this.hideActions.bind(this);
    this.showActions = this.showActions.bind(this);
    this.renderBody = this.renderBody.bind(this);
  }
  componentDidMount() {
    autosize(document.querySelector('.editor-textarea'));
  }
  onChange(e) {
    this.props.onChange({ e, value: e.target.value });
  }
  toggleHelp() {
    this.setState({ help: !this.state.help });
  }
  togglePreview() {
    this.setState({ preview: !this.state.preview });
  }
  hideActions() {
    if (this.props.value === '' && !this.state.preview && !this.state.help) {
      this.setState({ showActions: false });
    }
  }
  showActions() {
    console.log(this.state);
    this.setState({ showActions: true });
  }
  renderBody() {
    if (this.state.preview) {
      return (
        <div className="editor-preview pre-wrap">
          <div className="editor-preview-flash">
            Previewing your comment...
          </div>
          <div className="editor-preview-render">
            <Markdown
              source={this.props.value}
            />
          </div>
        </div>
      );
    }
    return null;
  }
  renderHelp() {
    if (this.state.help) {
      return (
        <div className="editor-help">
          <button
            name="help"
            className="editor-help-close-button"
            onClick={this.toggleHelp}
          >
            close
          </button>
          <div className="markdown-body">
            <div className="editor-help-row">
              *italics* or _italics_ → <Markdown format="inline" source="*italics*" />
            </div>
            <div className="editor-help-row">
              **bold** or __bold__ → <Markdown format="inline" source="**bold**" />
            </div>
            <div className="editor-help-row">
              [click here for google](https://google.com) → <Markdown state="inline" source="[click here for google](https://google.com)" />
            </div>
            <div className="editor-help-row">
              `console.log();` → <Markdown format="inline" source="`console.log();`" />
            </div>
            <div className="editor-help-row">
              &gt; motivational quote →{' '}
              <span className="editor-inline-blockquote">
                <Markdown format="block" source="> motivational quote" />
              </span>
            </div>
            <div className="editor-help-row">
              super^script^ → <Markdown format="inline" source="super^script^" />
            </div>
          </div>
        </div>
      );
    }
    return null;
  }
  render() {
    return (
      <ClickOutsideListener
        onClickOutside={this.hideActions}
      >
        <div
          className="editor"
          onFocus={this.showActions}
        >
          {this.renderBody()}
          <textarea
            ref={(textarea) => { this.textarea = textarea; }}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            // spellCheck="false"
            // onClick={this.onClick}
            onChange={this.onChange}
            value={this.props.value}
            className={classNames('editor-textarea', {
              none: this.state.preview,
            })}
            // name="body"
            rows={this.props.rows}
          />
          <div className={classNames('editor-actions', {
            show: this.state.showActions,
          })}
          >
            <button
              name="help"
              className={classNames('editor-action', {
                active: this.state.help,
              })}
              onClick={this.toggleHelp}
            >
              Markdown help
            </button>
            <button
              name="preview"
              className={classNames('editor-action right', {
                active: this.state.preview,
              })}
              onClick={this.togglePreview}
            >
              {(!this.state.preview) ? 'Preview comment' : 'Stop preview' }
            </button>
          </div>
          {this.renderHelp()}
        </div>
      </ClickOutsideListener>
    );
  }
}

Editor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  rows: PropTypes.string,
};

Editor.defaultProps = {
  value: '',
  rows: '4',
};

module.exports = Editor;
