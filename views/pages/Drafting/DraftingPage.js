import React from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';
import moment from 'moment';
import uniq from 'lodash/uniq';
import update from 'immutability-helper';

import {
  createFragmentContainer,
  commitMutation,
  graphql,
} from 'react-relay';

import Editor from 'global-components/Editor.js';
import TagBar from 'global-components/TagBar.js';

import { NewMemoryMutation } from './mutations/NewMemoryMutation.js';

class DraftingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      body: '',
      created: new Date(),
      tags: [],
    };
    this.onChange = this.onChange.bind(this);
    this.onChangeEditor = this.onChangeEditor.bind(this);
    this.newMemoryMutation = this.newMemoryMutation.bind(this);
    this.getState = this.getState.bind(this);
    this.onAddTag = this.onAddTag.bind(this);
    this.onRemoveTag = this.onRemoveTag.bind(this);
  }
  componentDidMount() {
    window.onbeforeunload = () => {
      if (this.state.body) {
        return 'Unsaved changes.';
      }
      return;
    };
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  onChangeEditor({ value }) {
    this.setState({ body: value });
  }
  getState() {
    console.log(this.state);
    console.log(uniq(this.state.tags));
    // this.state.mutation.dispose();
  }
  // onAddTag(tag) {
  //   console.log(tag);
  //   console.log(uniq([...this.state.tags, tag]));
  //   this.setState({ tags: uniq([...this.state.tags, tag]) });
  // }
  // onRemoveTag(index) {
  //   const newData = update(
  //     this.state.tags,
  //     { $splice: [[index, 1]] }
  //   );
  //   this.setState({ tags: newData });
  // }
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
        <div>
          <input
            name="title"
            className="drafting-title"
            placeholder="title"
            type="text"
            value={this.state.title}
            onChange={this.onChange}
          />
        </div>
        <div className="drafting-editor clearfix">
          <Editor
            value={this.state.body}
            onChange={this.onChangeEditor}
            rows="16"
          />
          {/* <TagBar
            tags={this.state.tags}
            me={this.props.viewer.me}
            onAddTag={this.onAddTag}
            onRemoveTag={this.onRemoveTag}
          /> */}
          <div className="drafting-actions">
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
          </div>
        </div>
      </div>
    );
  }
}

DraftingPage.propTypes = {
  viewer: PropTypes.object.isRequired,
};

export default createFragmentContainer(DraftingPage, {
  viewer: graphql`
    fragment DraftingPage_viewer on Viewer {
      id
      me {
        ...TagBar_me
      }
    }
  `,
});
