import React from 'react';
import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import { fromGlobalId } from 'graphql-base64';
// import format from 'date-fns/format';
// import moment from 'moment';
import autosize from 'autosize';
import stringLength from 'string-length';
import partial from 'lodash/partial';
import classNames from 'classnames';
import Mousetrap from 'mousetrap';
import mixpanel from 'mixpanel-browser';

import Editor from 'global-components/Editor.js';
import MetaPortal from 'global-components/MetaPortal.js';
// import Dropdown from 'global-components/Dropdown.js';
import DropdownProp from 'global-components/DropdownProp.js';
import Markdown from 'global-components/Markdown.js';
import MenuContextImage from 'global-components/MenuContextImage.js';

import { NewImageMutation } from 'global-mutations/NewImageMutation.js';

import { NewMemoryMutation } from './mutations/NewMemoryMutation.js';

mixpanel.init('ad1901a86703fb84525c156756e15e07');

class DraftingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      body: '',
      created: new Date(),
      preview: false,
      error: false,
    };
    this.onChange = this.onChange.bind(this);
    this.onClickImage = this.onClickImage.bind(this);
    this.newMemoryMutation = this.newMemoryMutation.bind(this);
    this.newImageMutation = this.newImageMutation.bind(this);
  }
  componentDidMount() {
    mixpanel.register({
      id: fromGlobalId(this.props.query.me.id).id,
      email: this.props.query.me.email,
    });
    window.onbeforeunload = () => {
      if (this.state.body || this.state.title) {
        return 'Unsaved changes.';
      }
      return;
    };
    Mousetrap.bind(['command+p', 'ctrl+p'], () => {
      this.setState({ preview: !this.state.preview });
      return false;
    });
  }
  onChange(e, key) {
    if (key === 'preview') {
      this.setState({ preview: !this.state.preview });
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
  newMemoryMutation() {
    const { title, body, created } = this.state;
    NewMemoryMutation({
      environment: this.props.relay.environment,
      title,
      body,
      created: Date.UTC(created),
    })
    .then((res) => {
      console.log(res);
      if (res.newMemory) {
        mixpanel.track('Create memory');
        window.onbeforeunload = null;
        window.location.href = '/';
      } else {
        this.setState({ error: true });
      }
    });
  }
  newImageMutation() {
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
  render() {
    return (
      <div className="draftingpage">
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
          /* new */
          {(this.state.preview) ? ' (preview mode)' : ''}
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
            <Editor
              value={this.state.body}
              onChange={partial(this.onChange, partial.placeholder, 'body')}
            />}
          <MetaPortal>
            <span className="meta-count left">
              <b>
                {stringLength(this.state.body) +
                  stringLength(this.state.title)}
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
              <li className="ddrow">
                <a
                  className="ddrow-btn"
                  href="/"
                  style={{ display: 'block' }}
                >
                  Cancel Memory
                </a>
              </li>
              {/* <li className="ddrow">
                <button className="ddrow-btn">
                  Toggle character count
                  <div className="ddrow-hint">
                    ({stringLength(this.state.body) + stringLength(this.state.title)} characters)
                  </div>
                </button>
              </li> */}
              <div className="dddivider" />
              <li className="ddrow">
                <button
                  className="ddrow-btn"
                  onClick={this.newMemoryMutation}
                >
                  Save as Memory
                </button>
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
                    onChange={this.newImageMutation}
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
      </div>
    );
  }
}

DraftingPage.propTypes = {
  query: PropTypes.object.isRequired,
};

// module.exports = DraftingPage;

export default createFragmentContainer(DraftingPage, {
  query: graphql`
    fragment DraftingPage_query on Query {
      id
      me {
        id
        email
        images(first: 10) @connection(
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
    }
  `,
});
