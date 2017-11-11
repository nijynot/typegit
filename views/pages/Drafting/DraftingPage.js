import React from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';
import moment from 'moment';

import {
  createFragmentContainer,
  commitMutation,
  graphql,
} from 'react-relay';

import Editor from 'global-components/Editor.js';

import { NewMemoryMutation } from './mutations/NewMemoryMutation.js';

class DraftingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      body: '',
      created: new Date(),
    };
    this.onChange = this.onChange.bind(this);
    this.onChangeEditor = this.onChangeEditor.bind(this);
    this.newMemoryMutation = this.newMemoryMutation.bind(this);
    this.getState = this.getState.bind(this);
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
  }
  newMemoryMutation() {
    const { title, body, created } = this.state;
    NewMemoryMutation({
      environment: this.props.relay.environment,
      title,
      body,
      created: Date.UTC(this.state.created),
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
        <div className="drafting-editor">
          <Editor
            value={this.state.body}
            onChange={this.onChangeEditor}
            rows="16"
          />
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
    }
  `,
});
