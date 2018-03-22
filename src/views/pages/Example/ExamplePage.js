import React from 'react';
import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import { fromGlobalId } from 'graphql-base64';
// import format from 'date-fns/format';
import moment from 'moment';
import autosize from 'autosize';
import stringLength from 'string-length';
import partial from 'lodash/partial';
import trimStart from 'lodash/trimStart';
import get from 'lodash/get';
import classNames from 'classnames';
import Mousetrap from 'mousetrap';
import mixpanel from 'mixpanel-browser';

import Editor from 'global-components/Editor.js';
import MetaPortal from 'global-components/MetaPortal.js';
// import Dropdown from 'global-components/Dropdown.js';
import DropdownProp from 'global-components/DropdownProp.js';
import Markdown from 'global-components/Markdown.js';
import MenuContextImage from 'global-components/MenuContextImage.js';

// import { NewImageMutation } from 'global-mutations/NewImageMutation.js';
//
// import { NewRepositoryMutation } from './mutations/NewRepositoryMutation.js';

mixpanel.init('ad1901a86703fb84525c156756e15e07');

const images = {
  edges: [
    {
      node: { id: 1, url: 'https://upload.wikimedia.org/wikipedia/en/2/24/Lenna.png' },
    },
  ],
};

class ExamplePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: 'Untitled',
      body: `# Untitled\n%[${moment.utc(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss')}]\n\nWhat's on your mind? Type here!`,
      created: moment.utc(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss'),
      preview: false,
      error: false,
      automatic: true,
      commitHeadline: '',
      help: true,
    };
    this.onChange = this.onChange.bind(this);
    this.onClickImage = this.onClickImage.bind(this);
    // this.mutationNewRepository = this.mutationNewRepository.bind(this);
    // this.newImageMutation = this.newImageMutation.bind(this);
    this.autodetect = this.autodetect.bind(this);
    this.showError = this.showError.bind(this);
    // this.tick = this.tick.bind(this);
  }
  componentDidMount() {
    // this.timerID = setInterval(
    //   () => this.tick(),
    //   1000
    // );
    mixpanel.register({
      id: 0,
      email: 'example@example.com',
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
  componentWillUnmount() {
    // clearInterval(this.timerID);
  }
  onChange(e, key) {
    if (key === 'preview') {
      this.setState({ preview: !this.state.preview });
    } else if (key === 'help') {
      this.setState({ help: !this.state.help });
    } else if (key === 'body' && this.state.automatic) {
      const { title, created } = this.autodetect();
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
  onClickImage(url) {
    this.setState({
      body: `${this.state.body}![](${url})\n`,
    }, () => {
      autosize.update(document.querySelector('.editor-ctrl'));
    });
  }
  // mutationNewRepository() {
  //   NewRepositoryMutation({
  //     environment: this.props.relay.environment,
  //     commitHeadline: this.state.commitHeadline,
  //     commitBody: '',
  //     title: this.state.title,
  //     text: this.state.body,
  //     created: this.state.created,
  //     auto_title: this.state.automatic,
  //     auto_created: this.state.automatic,
  //   })
  //   .then((res) => {
  //     console.log(res);
  //     if (res.newRepository) {
  //       mixpanel.track('Create memory');
  //       window.onbeforeunload = null;
  //       window.location.href = `/${res.newRepository.name}`;
  //     } else {
  //       this.setState({ error: true });
  //     }
  //   });
  // }
  // newImageMutation() {
  //   NewImageMutation({
  //     environment: this.props.relay.environment,
  //     uploadables: {
  //       file: this.upload.files.item(0),
  //     },
  //     me: this.props.query.me,
  //   })
  //   .then((res) => {
  //     console.log(res);
  //   });
  // }
  autodetect() {
    const title = trimStart(get(this.editor.value.match(/(#{1,6})(.*)/), '[2]', 'Untitled post'));
    const created = get(this.editor.value.match(/%\[((\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2}))\]/), '[1]');
    return { title, created };
  }
  showError() {
    this.setState({ error: true });
  }
  // tick() {
  //   this.setState({ created: new Date() });
  // }
  render() {
    return (
      <div className="draftingpage">
        {(!this.state.preview) ?
          <div className="home-msg-container">
            <span className="home-read-only-msg">
              You&apos;re currently in test-mode.{' '}
              <a
                className="home-sub-link"
                href="/register"
                target="_blank"
              >
                Register and subscribe
              </a> to save your progress!
            </span>
          </div> : null}
        {/* <div className="drafting-hint pre-wrap">
          {`\\/**
 * @new
 * @title ${this.state.title}
 * @date ${this.state.created} (UTC)
 *\\/`}
          {(this.state.preview) ? ' (preview mode)' : ''}
        </div> */}
        <div className="drafting-editor clearfix">
          {(this.state.preview) ?
            <Markdown source={this.state.body} /> :
            <Editor
              inputRef={(el) => { this.editor = el; }}
              value={this.state.body}
              onChange={partial(this.onChange, partial.placeholder, 'body')}
            />}
          <MetaPortal>
            <span className="meta-count left">
              {stringLength(this.state.body) +
                stringLength(this.state.title)}
              {' '}characters
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
              <li className="ddrow">
                <button
                  className="ddrow-btn"
                  onClick={partial(this.onChange, partial.placeholder, 'help')}
                >
                  Keyboard shortcuts and Hints
                </button>
              </li>
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
                  {/* <button
                    className="ddrow-save-btn left"
                    onClick={this.mutationUpdateRepository}
                  >
                    Save
                  </button> */}
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
              <div className="dddivider" />
              <li className="ddrow">
                <span className="ddrow-hint">Commit</span>
                <input
                  className="ddrow-input"
                  placeholder="Initial commit"
                  value={this.state.commitHeadline}
                  // disabled={this.state.automatic}
                  onChange={partial(this.onChange, partial.placeholder, 'commitHeadline')}
                />
                <div className="ddcontainer clearfix">
                  <button
                    className="left ddrow-save-btn"
                    onClick={this.showError}
                  >
                    Create initial commit
                  </button>
                </div>
                {/* <li className="ddrow">
                  <a
                    className="ddrow-btn"
                    href="/"
                    style={{ display: 'block' }}
                  >
                    Cancel Memory
                  </a>
                </li> */}
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-upload">
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
                {images.edges.map(edge => (
                  <MenuContextImage
                    image={edge.node}
                    onClick={() => { this.onClickImage(edge.node.url); }}
                  />
                ))}
              </li>
              {/* <li className="ddrow">
                <a href="/images">
                  <button className="ddrow-btn">
                    To all images
                  </button>
                </a>
              </li> */}
            </DropdownProp>
          </MetaPortal>
        </div>
        {(this.state.help) ?
          <div className="drafting-help">
            <button
              className="drafting-help-close-btn right"
              onClick={partial(this.onChange, partial.placeholder, 'help')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div className="drafting-help-content markdown-body inline">
              <span className="drafting-help-label">Keyboard shortcuts</span>
              <kbd>Ctrl</kbd> + <kbd>P</kbd> to <em>preview</em> your post.
              <div className="dddivider" />
              <span className="drafting-help-label">Hints</span>
              A hashtag symbol (#) followed by a non-whitespace character will result in a hashtag.
              E.g. &ldquo;#draft&rdquo; will successfully create a hashtag, while &ldquo;# draft&rdquo; will create a <em>markdown heading</em>.<br />
              The automatic feature will pick the first heading as title, and the first custom date as date.
              <div className="dddivider" />
              <span className="drafting-help-label">Markdown</span>
              The <code>h1</code> heading is always centered.<br />
              &ldquo;%[YYYY-MM-DD HH:mm:ss]&rdquo; is custom markdown that will only parse in Typegit. The output is formatted as &ldquo;dddd, MMMM Do, YYYY&rdquo;.<br />
              <a href="https://guides.github.com/features/mastering-markdown/">
                Github&apos;s Markdown Guide
              </a> for a more complete guide of the supported markdown syntax. Not everything from Github&apos;s guide is supported, but most is.
              <div className="dddivider" />
              <span className="drafting-help-label">Git</span>
              Command for cloning: <kbd>git clone &lt;url&gt;.git</kbd><br />
              Command for pushing: <kbd>git push origin master</kbd>
            </div>
          </div> : null}
      </div>
    );
  }
}

ExamplePage.propTypes = {
  query: PropTypes.object.isRequired,
};

export default createFragmentContainer(ExamplePage, {
  query: graphql`
    fragment ExamplePage_query on Query {
      id
    }
  `,
});
