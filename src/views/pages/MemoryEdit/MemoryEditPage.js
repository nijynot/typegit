import React from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';
import moment from 'moment';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import { fromGlobalId } from 'graphql-base64';
import partial from 'lodash/partial';
import stringLength from 'string-length';
import autosize from 'autosize';
import classNames from 'classnames';
import Mousetrap from 'mousetrap';

import Editor from 'global-components/Editor.js';
import MetaPortal from 'global-components/MetaPortal.js';
import DropdownProp from 'global-components/DropdownProp.js';
import Markdown from 'global-components/Markdown.js';

import { DeleteMemoryMutation } from './mutations/DeleteMemoryMutation.js';
import { UpdateMemoryMutation } from './mutations/UpdateMemoryMutation.js';

class MemoryEditPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      preview: false,
      title: this.props.query.memory.title,
      body: this.props.query.memory.body,
      created: this.props.query.memory.created,
      save: false,
      error: false,
    };
    this.onChange = this.onChange.bind(this);
    this.deleteMemoryMutation = this.deleteMemoryMutation.bind(this);
    this.updateMemoryMutation = this.updateMemoryMutation.bind(this);
    this.getState = this.getState.bind(this);
  }
  componentDidMount() {
    window.onbeforeunload = () => {
      if (
        (
          this.state.body !== this.props.query.memory.body ||
          this.state.title !== this.props.query.memory.title
        )
      ) {
        return 'Unsaved changes.';
      }
      return;
    };
    autosize(document.querySelector('.dummyclass'));
    Mousetrap.bind(['command+p', 'ctrl+p'], () => {
      this.setState({ preview: !this.state.preview });
      return false;
    });
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
  deleteMemoryMutation() {
    if (window.confirm('Are you sure you want to delete this Memory?') === true) {
      DeleteMemoryMutation({
        environment: this.props.relay.environment,
        id: this.props.query.memory.id,
      })
      .then((res) => {
        if (res.deleteMemory) {
          document.location.href = '/';
        } else {
          this.setState({ error: true });
        }
      });
    }
  }
  updateMemoryMutation() {
    const { title, body, created } = this.state;
    UpdateMemoryMutation({
      environment: this.props.relay.environment,
      id: this.props.query.memory.id,
      title,
      body,
      created,
    })
    .then((res) => {
      if (res.updateMemory) {
        window.onbeforeunload = null;
        document.location.href = `/${fromGlobalId(this.props.query.memory.id).id}`;
      } else {
        this.setState({ error: true });
      }
    });
  }
  render() {
    return (
      <div className="memoryeditpage clearfix">
        {(this.state.error) ?
          <div className="home-msg-container">
            <span className="home-read-only-msg">
              Something went wrong. Are you{' '}
              <a
                className="home-sub-link"
                href="/settings/subscription"
              >
                subscribed?
              </a>
            </span>
          </div> : null}
        <div className="drafting-hint">
          /* edit {fromGlobalId(this.props.query.memory.id).id} */
        </div>
        <div>
          <input
            className="memoryedit-title"
            placeholder="Title"
            type="text"
            value={this.state.title}
            onChange={partial(this.onChange, partial.placeholder, 'title')}
          />
        </div>
        <div>
          <input
            className="memoryedit-created"
            placeholder="date"
            type="text"
            value={this.state.created}
            onChange={partial(this.onChange, partial.placeholder, 'created')}
          />
        </div>
        <div className="memoryedit-editor clearfix">
          {(this.state.preview) ?
            <Markdown source={this.state.body || ''} /> :
            <Editor
              value={this.state.body}
              onChange={partial(this.onChange, partial.placeholder, 'body')}
            />}
        </div>
        <MetaPortal>
          <span className="meta-count left">
            <b>
              {stringLength(this.props.query.memory.body || '') +
                stringLength(this.props.query.memory.title || '')}
            </b>{' '}characters
          </span>
          <DropdownProp
            containerClassName="drafting-action right clearfix"
            className="ddmenu pull-left"
            toggle={open => (
              <button
                onClick={open}
                className="drafting-actions-btn meta-dots"
              >
                <svg className="feather-dots" width="24" height="24" viewBox="0 0 24 24">
                  <path d="M5 12.5c0 .552.195 1.023.586 1.414.39.39.862.586 1.414.586.552 0 1.023-.195 1.414-.586.39-.39.586-.862.586-1.414 0-.552-.195-1.023-.586-1.414A1.927 1.927 0 0 0 7 10.5c-.552 0-1.023.195-1.414.586-.39.39-.586.862-.586 1.414zm5.617 0c0 .552.196 1.023.586 1.414.391.39.863.586 1.414.586.552 0 1.023-.195 1.414-.586.39-.39.586-.862.586-1.414 0-.552-.195-1.023-.586-1.414a1.927 1.927 0 0 0-1.414-.586c-.551 0-1.023.195-1.414.586-.39.39-.586.862-.586 1.414zm5.6 0c0 .552.195 1.023.586 1.414.39.39.868.586 1.432.586.551 0 1.023-.195 1.413-.586.391-.39.587-.862.587-1.414 0-.552-.196-1.023-.587-1.414a1.927 1.927 0 0 0-1.413-.586c-.565 0-1.042.195-1.432.586-.39.39-.586.862-.587 1.414z" fillRule="evenodd" />
                </svg>
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
            {/* <li className="ddrow">
              <button className="ddrow-btn">
                Change creation date
              </button>
            </li> */}
            <li className="ddrow">
              <button className="ddrow-btn">
                Keyboard shortcuts
              </button>
            </li>
            {/* <li className="ddrow">
              <button className="ddrow-btn">
                Toggle top-bar
                <div className="ddrow-hint">
                  ({stringLength(this.state.body || '') + stringLength(this.state.title || '')} characters)
                </div>
              </button>
            </li> */}
            <li className="ddrow">
              <a
                className="ddrow-btn"
                href={`/${fromGlobalId(this.props.query.memory.id).id}`}
                style={{ display: 'block' }}
              >
                Cancel Memory
              </a>
            </li>
            <div className="dddivider" />
            <li className="ddrow">
              <button
                className="ddrow-btn"
                onClick={this.deleteMemoryMutation}
              >
                Delete Memory
              </button>
            </li>
            <div className="dddivider" />
            <li className="ddrow">
              <button
                className="ddrow-btn"
                onClick={this.updateMemoryMutation}
              >
                Update Memory
              </button>
            </li>
          </DropdownProp>
        </MetaPortal>
      </div>
    );
  }
}

MemoryEditPage.propTypes = {
  query: PropTypes.object.isRequired,
};

export default createFragmentContainer(MemoryEditPage, {
  query: graphql`
    fragment MemoryEditPage_query on Query {
      memory(id: $id) {
        id
        title
        body
        created
        user {
          id
          username
        }
      }
    }
  `,
});
