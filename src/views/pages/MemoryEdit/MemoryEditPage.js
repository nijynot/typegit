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
import trimStart from 'lodash/trimStart';
import get from 'lodash/get';

import Editor from 'global-components/Editor.js';
import MetaPortal from 'global-components/MetaPortal.js';
import DropdownProp from 'global-components/DropdownProp.js';
import Markdown from 'global-components/Markdown.js';
import MenuContextImage from 'global-components/MenuContextImage.js';

import { NewImageMutation } from 'global-mutations/NewImageMutation.js';

import { DeleteMemoryMutation } from './mutations/DeleteMemoryMutation.js';
import { UpdateMemoryMutation } from './mutations/UpdateMemoryMutation.js';
import { UpdateRepositoryMutation } from './mutations/UpdateRepositoryMutation.js';
import { NewCommitMutation } from './mutations/NewCommitMutation.js';

class MemoryEditPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      preview: false,
      title: this.props.query.repository.title,
      body: this.props.query.repository.defaultBranchRef.target.tree.entry.object.text,
      created: this.props.query.repository.created,
      // save: false,
      error: false,
      automatic: this.props.query.repository.auto_title,
      commitHeadline: '',
    };
    this.onChange = this.onChange.bind(this);
    this.onClickImage = this.onClickImage.bind(this);
    this.deleteMemoryMutation = this.deleteMemoryMutation.bind(this);
    this.mutationNewImage = this.mutationNewImage.bind(this);
    this.mutationUpdateRepository = this.mutationUpdateRepository.bind(this);
    this.mutationNewCommit = this.mutationNewCommit.bind(this);
    this.autodetect = this.autodetect.bind(this);
  }
  componentDidMount() {
    window.onbeforeunload = () => {
      if (
        this.state.body !==
        this.props.query.repository.defaultBranchRef.target.tree.entry.object.text
      ) {
        return 'Unsaved changes.';
      }
      return;
    };
    autosize(document.querySelector('.memoryedit-title'));
    Mousetrap.bind(['command+p', 'ctrl+p'], () => {
      this.setState({ preview: !this.state.preview });
      return false;
    });
    console.log(this.state.body.match(/(#{1,6})(.*)/));
  }
  onChange(e, key) {
    if (key === 'preview') {
      this.setState({ preview: !this.state.preview });
    } else if (key === 'body' && this.state.automatic) {
      const { title, created } = this.autodetect();
      // const title = trimStart(get(e.target.value.match(/(#{1,6})(.*)/), '[2]', 'Untitled post'));
      this.setState({
        title,
        created,
        body: e.target.value,
      });
    } else if (key === 'automatic') {
      if (e.target.checked) {
        const { title, created } = this.autodetect();
        this.setState({
          title,
          created,
          automatic: e.target.checked,
        });
      } else {
        this.setState({ automatic: e.target.checked });
      }
    } else {
      this.setState({ [key]: e.target.value });
    }
  }
  onClickImage(uuid) {
    this.setState({
      body: `${this.state.body}![](/assets/img/${uuid})\n`,
    }, () => {
      autosize.update(document.querySelector('.editor-ctrl'));
    });
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
  // updateMemoryMutation() {
  //   UpdateMemoryMutation({
  //     environment: this.props.relay.environment,
  //     id: this.props.query.memory.id,
  //     title: this.state.title,
  //     body: this.state.body,
  //     created: this.state.created,
  //   })
  //   .then((res) => {
  //     if (res.updateMemory) {
  //       window.onbeforeunload = null;
  //       document.location.href = `/${fromGlobalId(this.props.query.memory.id).id}`;
  //     } else {
  //       this.setState({ error: true });
  //     }
  //   });
  // }
  mutationNewImage() {
    NewImageMutation({
      environment: this.props.relay.environment,
      uploadables: {
        file: this.upload.files.item(0),
      },
      me: this.props.query.me,
    })
    .then((res) => {
      console.log(res);
    });
  }
  mutationUpdateRepository() {
    UpdateRepositoryMutation({
      environment: this.props.relay.environment,
      id: this.props.query.repository.id,
      title: this.state.title,
      auto_title: this.state.automatic,
      description: '',
      created: this.state.created,
      auto_created: this.state.automatic,
    })
    .then((res) => {
      if (res.updateRepository) {
        console.log(res);
        this.editor.click();
        // window.onbeforeunload = null;
        // document.location.href = `/${this.props.query.repository.name}`;
      } else {
        this.setState({ error: true });
      }
    });
  }
  mutationNewCommit() {
    NewCommitMutation({
      environment: this.props.relay.environment,
      repositoryId: this.props.query.repository.id,
      commitHeadline: this.state.commitHeadline,
      commitBody: '',
      text: this.state.body,
    })
    .then((res) => {
      if (res.newCommit) {
        // console.log(res);
        // this.editor.click();
        window.onbeforeunload = null;
        document.location.href = `/${this.props.query.repository.name}`;
      } else {
        this.setState({ error: true });
      }
    });
  }
  autodetect() {
    const title = trimStart(get(this.editor.value.match(/(#{1,6})(.*)/), '[2]', 'Untitled post'));
    const created = get(this.editor.value.match(/%\[((\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2}))\]/), '[1]');
    return { title, created };
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
        <div className="drafting-hint pre-wrap">
          {`/**
 * @edit ${this.props.query.repository.name}
 * @title ${this.state.title}
 * @date ${this.state.created} (UTC)
 */`}
          {/* * @now ${moment.utc(new Date()).format('YYYY-MM-DD HH:mm:ss')} */}
          {(this.state.preview) ? ' (preview mode)' : ''}
        </div>
        {/* <div>
          <textarea
            rows="1"
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
        </div> */}
        <div className="memoryedit-editor clearfix">
          {(this.state.preview) ?
            <Markdown source={this.state.body || ''} /> :
            <Editor
              inputRef={(el) => { this.editor = el; }}
              value={this.state.body}
              onChange={partial(this.onChange, partial.placeholder, 'body')}
            />}
        </div>
        <MetaPortal>
          <span className="meta-count left">
            <b>
              {stringLength(this.props.query.repository.defaultBranchRef.target.tree.entry.object.text || '')}
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
            <div className="dddivider" />
            <li className="ddrow">
              <span className="ddrow-hint">Title</span>
              <input
                className="ddrow-input"
                placeholder="Untitled post"
                value={this.state.title}
                disabled={this.state.automatic}
                onChange={partial(this.onChange, partial.placeholder, 'title')}
              />
              <span className="ddrow-hint">Date</span>
              <input
                className="ddrow-input"
                placeholder="datetime"
                value={this.state.created}
                disabled={this.state.automatic}
                onChange={partial(this.onChange, partial.placeholder, 'created')}
              />
              <div className="ddcheckbox-container ddcontainer clearfix">
                <button
                  className="ddrow-save-btn left"
                  onClick={this.mutationUpdateRepository}
                >
                  Save
                </button>
                <label htmlFor="auto_created">
                  <input
                    id="auto_created"
                    type="checkbox"
                    checked={this.state.automatic}
                    onChange={partial(this.onChange, partial.placeholder, 'automatic')}
                  />
                  <span>
                    Automatic
                  </span>
                </label>
              </div>
            </li>
            {/* <div className="dddivider" />
            <li className="ddrow">
              <a
                className="ddrow-btn"
                href={`/${this.props.query.repository.name}`}
                style={{ display: 'block' }}
              >
                Cancel Editing
              </a>
            </li> */}
            <div className="dddivider" />
            <li className="ddrow">
              <button
                className="ddrow-btn"
                onClick={this.deleteMemoryMutation}
              >
                Delete post
              </button>
            </li>
            <div className="dddivider" />
            <li className="ddrow">
              <span className="ddrow-hint">Commit</span>
              <input
                className="ddrow-input"
                placeholder="Update index.md"
                value={this.state.commitHeadline}
                // disabled={this.state.automatic}
                onChange={partial(this.onChange, partial.placeholder, 'commitHeadline')}
              />
              <div className="ddcontainer clearfix">
                <button
                  className="left ddrow-save-btn"
                  onClick={this.mutationNewCommit}
                >
                  Commit changes
                </button>
              </div>
              {/* <button
                className="ddrow-btn"
                // onClick={this.updateMemoryMutation}
              >
                Commit changes
              </button> */}
            </li>
          </DropdownProp>
          <DropdownProp
            containerClassName="drafting-action right clearfix"
            className="ddmenu pull-left image-menu"
            toggle={open => (
              <button
                onClick={open}
                className="drafting-actions-btn meta-image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-image">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </button>
            )}
          >
            <li className="ddrow">
              <label htmlFor="image-upload">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-upload">
                  <path shapeRendering="optimizeQuality" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline shapeRendering="optimizeQuality" points="17 8 12 3 7 8" />
                  <line shapeRendering="optimizeQuality" x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <input
                  ref={(n) => { this.upload = n; }}
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={this.mutationNewImage}
                />
                Upload image
              </label>
            </li>
            <div className="dddivider" />
            <li className="ddrow">
              {this.props.query.me.images.edges.map(edge => (
                <MenuContextImage
                  image={edge.node}
                  onClick={() => { this.onClickImage(fromGlobalId(edge.node.id).id); }}
                />
              ))}
            </li>
            <li className="ddrow">
              <a href="/images">
                <button className="ddrow-btn">
                  To all images
                </button>
              </a>
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
      me {
        id
        images (first: 10) @connection(
          key: "DraftingPage_images"
        ) {
          edges {
            node {
              id
              ...MenuContextImage_image
            }
          }
        }
      }
      repository(id: $id) {
        id
        name
        title
        auto_title
        description
        created
        auto_created
        defaultBranchRef {
          target {
            ... on Commit {
              tree {
                entry(name: "index.md") {
                  object {
                    ... on Blob {
                      text
                    }
                  }
                }
              }
            }
          }
        }
      }
      # memory(id: $id) {
      #   id
      #   title
      #   body
      #   created
      #   user {
      #     id
      #     username
      #   }
      # }
    }
  `,
});
