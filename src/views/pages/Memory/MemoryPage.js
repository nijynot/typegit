import React from 'react';
import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import { fromGlobalId } from 'graphql-base64';
import stringLength from 'string-length';
import moment from 'moment';

import MetaPortal from 'global-components/MetaPortal.js';
import Markdown from 'global-components/Markdown.js';

class MemoryPage extends React.Component {
  render() {
    return (
      <div className="memorypage">
        {/* <h1 className="memory-title">
          {this.props.query.memory.title || 'Untitled memory'}
        </h1>
        <span className="memory-timestamp">{moment.utc(this.props.query.memory.created).local().format('dddd, MMMM Do, YYYY')}</span> */}
        <div className="markdown-body memory-body">
          {(this.props.query.repository.defaultBranchRef.target.tree.entry.object.text) ?
            <Markdown
              source={this.props.query.repository.defaultBranchRef.target.tree.entry.object.text}
            /> :
            <span className="empty-body">
              Empty body
            </span>}
        </div>
        {/* <p className="memory-body pre-wrap">
          {this.props.query.memory.body}
        </p> */}
        <MetaPortal>
          <span className="meta-count left">
            {stringLength(this.props.query.repository.defaultBranchRef.target.tree.entry.object.text || '')}
            {' '}characters
          </span>
          <a
            href={`/${this.props.query.repository.name}/edit`}
            className="memory-edit-btn right"
          >
            Edit
          </a>
          <a
            href={`/${this.props.query.repository.name}/history`}
            className="memory-edit-btn right"
          >
            History
          </a>
        </MetaPortal>
      </div>
    );
  }
}

MemoryPage.propTypes = {
  query: PropTypes.object.isRequired,
};

export default createFragmentContainer(MemoryPage, {
  query: graphql`
    fragment MemoryPage_query on Query {
      repository(id: $id) {
        id
        name
        title
        description
        created
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
    }
  `,
});

// memory(id: $id) {
//   id
//   title
//   body
//   created
//   user {
//     id
//   }
// }
