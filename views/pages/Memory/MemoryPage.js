import React from 'react';
import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import { fromGlobalId } from 'graphql-base64';

import MetaPortal from 'global-components/MetaPortal.js';

class MemoryPage extends React.Component {
  render() {
    return (
      <div className="memorypage">
        <h1 className="memory-title">
          {this.props.viewer.memory.title}
        </h1>
        <p className="memory-body pre-wrap">
          {this.props.viewer.memory.body}
        </p>
        <MetaPortal>
          <a
            href={`/${fromGlobalId(this.props.viewer.memory.id).id}/edit`}
            className="memory-edit-btn right text"
          >
            Edit
          </a>
        </MetaPortal>
      </div>
    );
  }
}

MemoryPage.propTypes = {
  viewer: PropTypes.object.isRequired,
};

export default createFragmentContainer(MemoryPage, {
  viewer: graphql`
    fragment MemoryPage_viewer on Viewer {
      memory(id: $id) {
        id
        title
        body
        created
        user {
          id
        }
      }
    }
  `,
});
