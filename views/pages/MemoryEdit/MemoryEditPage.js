import React from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';
import moment from 'moment';

import {
  createFragmentContainer,
  graphql,
} from 'react-relay';

import Editor from 'global-components/Editor.js';

import { DeleteMemoryMutation } from './mutations/DeleteMemoryMutation.js';
import { UpdateMemoryMutation } from './mutations/UpdateMemoryMutation.js';

class MemoryEditPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.viewer.memory.title,
      body: this.props.viewer.memory.body,
      created: this.props.viewer.memory.created,
      save: false,
    };
    this.onChange = this.onChange.bind(this);
    this.onChangeEditor = this.onChangeEditor.bind(this);
    this.deleteMemoryMutation = this.deleteMemoryMutation.bind(this);
    this.updateMemoryMutation = this.updateMemoryMutation.bind(this);
    this.getState = this.getState.bind(this);
  }
  componentDidMount() {
    window.onbeforeunload = () => {
      if ((this.state.body !== this.props.viewer.memory.body
      || this.state.title !== this.props.viewer.memory.title)
      && !this.state.save) {
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
  deleteMemoryMutation() {
    if (window.confirm('Are you sure you want to delete this Memory?') === true) {
      DeleteMemoryMutation({
        environment: this.props.relay.environment,
        id: this.props.viewer.memory.id,
      }, () => {
        document.location.href = '/';
      });
    }
  }
  updateMemoryMutation() {
    const { title, body, created } = this.state;
    UpdateMemoryMutation({
      environment: this.props.relay.environment,
      id: this.props.viewer.memory.id,
      title,
      body,
      created,
    }, () => {
      this.setState({ save: true }, () => {
        document.location.href = `/${this.props.viewer.memory.id}`;
      });
    });
  }
  render() {
    return (
      <div className="memoryeditpage clearfix">
        <div>
          <input
            name="title"
            className="memoryedit-title"
            placeholder="title"
            type="text"
            value={this.state.title}
            onChange={this.onChange}
          />
        </div>
        <div className="memoryedit-editor clearfix">
          <Editor
            value={this.state.body}
            onChange={this.onChangeEditor}
            rows="16"
          />
          <button
            className="memoryedit-btn memory right"
            onClick={this.updateMemoryMutation}
          >
            Save Memory
          </button>
          <button
            className="memoryedit-btn draft right"
            onClick={this.getState}
          >
            Save Draft
          </button>
          <input
            name="created"
            className="memoryedit-date-ctrl right"
            onChange={this.onChange}
            placeholder="YYYY-MM-DD HH:mm:ss"
            value={format(this.state.created, 'YYYY-MM-DD HH:mm:ss')}
            // type="number"
          />
          <a
            className="memoryedit-btn cancel left"
            href="/"
          >
            cancel
          </a>
          <button
            className="memoryedit-btn cancel left"
            onClick={this.deleteMemoryMutation}
          >
            Delete Memory
          </button>
        </div>
      </div>
    );
  }
}

MemoryEditPage.propTypes = {
  viewer: PropTypes.object.isRequired,
};

export default createFragmentContainer(MemoryEditPage, {
  viewer: graphql`
    fragment MemoryEditPage_viewer on Viewer {
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
