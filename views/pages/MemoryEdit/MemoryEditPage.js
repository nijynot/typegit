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
// import { EditMemoryMutation } from './mutations/EditMemoryMutation.js';

class MemoryEditPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.viewer.memory.title,
      body: this.props.viewer.memory.body,
      created: new Date(),
    };
    this.onChange = this.onChange.bind(this);
    this.onChangeEditor = this.onChangeEditor.bind(this);
    this.deleteMemoryMutation = this.deleteMemoryMutation.bind(this);
    // this.editMemoryMutation = this.editMemoryMutation.bind(this);
    this.getState = this.getState.bind(this);
  }
  componentDidMount() {
    window.onbeforeunload = () => {
      if (this.state.body !== this.props.viewer.memory.body
      || this.state.title !== this.props.viewer.memory.title) {
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
  // editMemoryMutation() {
  //   const { title, body } = this.state;
  //   EditMemoryMutation({
  //     environment: this.props.relay.environment,
  //     title,
  //     body,
  //     created: Date.UTC(this.state.created),
  //   });
  // }
  render() {
    return (
      <div className="memoryeditpage">
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
        <div className="memoryedit-editor">
          <Editor
            value={this.state.body}
            onChange={this.onChangeEditor}
            rows="16"
          />
          <button
            className="memoryedit-btn memory right"
            // onClick={this.newMemoryMutation}
          >
            Save as Memory
          </button>
          <button
            className="memoryedit-btn draft right"
            onClick={this.getState}
          >
            Save as Draft
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
