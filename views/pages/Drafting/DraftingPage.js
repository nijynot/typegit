import React from 'react';
import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import format from 'date-fns/format';
import moment from 'moment';
import autosize from 'autosize';
import stringLength from 'string-length';
import partial from 'lodash/partial';
import classNames from 'classnames';

import Editor from 'global-components/Editor.js';
import MetaPortal from 'global-components/MetaPortal.js';
import Dropdown from 'global-components/Dropdown.js';
import DropdownProp from 'global-components/DropdownProp.js';
import Markdown from 'global-components/Markdown.js';

import { NewMemoryMutation } from './mutations/NewMemoryMutation.js';

class DraftingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      body: '',
      created: new Date(),
      preview: false,
    };
    this.onChange = this.onChange.bind(this);
    this.newMemoryMutation = this.newMemoryMutation.bind(this);
    this.getState = this.getState.bind(this);
  }
  componentDidMount() {
    window.onbeforeunload = () => {
      if (this.state.body || this.state.title) {
        return 'Unsaved changes.';
      }
      return;
    };
    autosize(document.querySelector('.dummyclass'));
  }
  onChange(e, key) {
    console.log(key);
    if (key === 'preview') {
      this.setState({ preview: !this.state.preview });
    } else {
      this.setState({ [key]: e.target.value });
    }
  }
  getState() {
    console.log(this.state);
  }
  newMemoryMutation() {
    const { title, body, created } = this.state;
    NewMemoryMutation({
      environment: this.props.relay.environment,
      title,
      body,
      created: Date.UTC(created),
    });
  }
  render() {
    return (
      <div className="draftingpage">
        <div className="drafting-hint">
          /* new */
        </div>
        <div>
          <input
            name="title"
            className="drafting-title"
            placeholder="Title"
            type="text"
            value={this.state.title}
            onChange={partial(this.onChange, partial.placeholder, 'title')}
          />
        </div>
        <div className="drafting-editor clearfix">
          {(this.state.preview) ?
            <Markdown source={this.state.body} /> :
            <textarea
              className="dummyclass"
              name="body"
              value={this.state.body}
              onChange={partial(this.onChange, partial.placeholder, 'body')}
              placeholder="What's on your mind?"
            />}
          <MetaPortal>
            <DropdownProp
              containerClassName="drafting-action right clearfix"
              className="ddmenu pull-left"
              toogle={open => (
                <button
                  onClick={open}
                  className="drafting-actions-btn"
                >
                  <span className="drafting-svg-icon dots">
                    <svg className="svgIcon-use" width="25" height="25" viewBox="0 0 25 25"><path d="M5 12.5c0 .552.195 1.023.586 1.414.39.39.862.586 1.414.586.552 0 1.023-.195 1.414-.586.39-.39.586-.862.586-1.414 0-.552-.195-1.023-.586-1.414A1.927 1.927 0 0 0 7 10.5c-.552 0-1.023.195-1.414.586-.39.39-.586.862-.586 1.414zm5.617 0c0 .552.196 1.023.586 1.414.391.39.863.586 1.414.586.552 0 1.023-.195 1.414-.586.39-.39.586-.862.586-1.414 0-.552-.195-1.023-.586-1.414a1.927 1.927 0 0 0-1.414-.586c-.551 0-1.023.195-1.414.586-.39.39-.586.862-.586 1.414zm5.6 0c0 .552.195 1.023.586 1.414.39.39.868.586 1.432.586.551 0 1.023-.195 1.413-.586.391-.39.587-.862.587-1.414 0-.552-.196-1.023-.587-1.414a1.927 1.927 0 0 0-1.413-.586c-.565 0-1.042.195-1.432.586-.39.39-.586.862-.587 1.414z" fillRule="evenodd"></path></svg>
                  </span>
                </button>
              )}
            >
              <li className="ddrow">
                <button
                  className={classNames('ddrow-btn', {
                    preview: this.state.preview,
                  })}
                  onClick={partial(this.onChange, partial.placeholder, 'preview')}
                >
                  Preview {(this.state.preview) ? '(Active)' : null}
                </button>
              </li>
              <li className="ddrow">
                <button className="ddrow-btn">
                  Change creation date
                </button>
              </li>
              <li className="ddrow">
                <button className="ddrow-btn">
                  Keyboard shortcuts
                </button>
              </li>
              <li className="ddrow">
                <a
                  className="ddrow-btn"
                  href="/"
                  style={{ display: 'block' }}
                >
                  Cancel Memory
                </a>
              </li>
              <li className="ddrow">
                <button className="ddrow-btn">
                  Toggle character count
                </button>
                <div className="ddrow-hint">
                  ({stringLength(this.state.body) + stringLength(this.state.title)} characters)
                </div>
              </li>
              <div className="dddivider" />
              <li className="ddrow">
                <button
                  className="ddrow-btn"
                  onClick={this.newMemoryMutation}
                >
                  Save as Memory
                </button>
              </li>
              {/* <li className="ddrow">
                <button className="ddrow-btn">
                  Save as Draft
                </button>
              </li>
              <div className="dddivider" />
              <li className="ddrow">
                <button className="ddrow-btn">
                  Save to Archive
                </button>
              </li> */}
            </DropdownProp>
          </MetaPortal>
          {/* <MetaPortal>
            <button
              onClick={() => { this.openDropdown('actionIsOpen'); }}
            >
              <svg className="svgIcon-use" width="25" height="25" viewBox="0 0 25 25"><path d="M5 12.5c0 .552.195 1.023.586 1.414.39.39.862.586 1.414.586.552 0 1.023-.195 1.414-.586.39-.39.586-.862.586-1.414 0-.552-.195-1.023-.586-1.414A1.927 1.927 0 0 0 7 10.5c-.552 0-1.023.195-1.414.586-.39.39-.586.862-.586 1.414zm5.617 0c0 .552.196 1.023.586 1.414.391.39.863.586 1.414.586.552 0 1.023-.195 1.414-.586.39-.39.586-.862.586-1.414 0-.552-.195-1.023-.586-1.414a1.927 1.927 0 0 0-1.414-.586c-.551 0-1.023.195-1.414.586-.39.39-.586.862-.586 1.414zm5.6 0c0 .552.195 1.023.586 1.414.39.39.868.586 1.432.586.551 0 1.023-.195 1.413-.586.391-.39.587-.862.587-1.414 0-.552-.196-1.023-.587-1.414a1.927 1.927 0 0 0-1.413-.586c-.565 0-1.042.195-1.432.586-.39.39-.586.862-.587 1.414z" fillRule="evenodd"></path></svg>
            </button>
            <Dropdown
              className="menumodal pull-right"
              isOpen={this.state.actionIsOpen}
              onRequestClose={this.closeDropdown}
            >
              <li>
                Preview memory
              </li>
              <li>
                Hints and Keyboard shortcuts
              </li>
              <li>
                Cancel editing
              </li>
              <li>
                Delete memory
              </li>
            </Dropdown>
          </MetaPortal> */}
          {/* <div className="drafting-actions">
            <button
              className="drafting-btn memory right"
              onClick={this.newMemoryMutation}
            >
              Save as Memory
            </button>
            <button
              className="drafting-btn draft right"
              onClick={this.getState}
            >
              Save as Draft
            </button>
            <input
              name="created"
              className="drafting-date-ctrl right"
              onChange={this.onChange}
              placeholder="YYYY-MM-DD HH:mm:ss"
              value={format(this.state.created, 'YYYY-MM-DD HH:mm:ss')}
              // type="number"
            />
            <a
              className="drafting-btn cancel left"
              href="/"
            >
              cancel
            </a>
          </div> */}
        </div>
      </div>
    );
  }
}

DraftingPage.propTypes = {
  viewer: PropTypes.object.isRequired,
};

// module.exports = DraftingPage;

export default createFragmentContainer(DraftingPage, {
  viewer: graphql`
    fragment DraftingPage_viewer on Viewer {
      id
    }
  `,
});
