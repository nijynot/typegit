import React from 'react';
import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import isEmpty from 'lodash/isEmpty';
import stringLength from 'string-length';

import Markdown from 'global-components/Markdown.js';
import MetaPortal from 'global-components/MetaPortal.js';

class CommitPage extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
  }
  render() {
    return (
      <div className="memorypage">
        <div className="markdown-body memory-body">
          {(this.props.query.repository.object.tree.entry.object.text) ?
            <Markdown
              source={this.props.query.repository.object.tree.entry.object.text}
            /> :
            <span className="empty-body">
              Empty body
            </span>}
        </div>
        <MetaPortal>
          <span className="meta-count left">
            <b>
              {stringLength(this.props.query.repository.object.tree.entry.object.text || '')}
            </b>{' '}characters @{' '}
            <span className="meta-partial-oid">
              {this.props.query.repository.object.partialOid}
            </span>
          </span>
          {/* <a href="/new" className="meta-plus home-new-link right">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </a> */}
          {/* <Search query={this.props.query} /> */}
        </MetaPortal>
      </div>
    );
  }
}

CommitPage.propTypes = {
  query: PropTypes.object.isRequired,
};

export default createFragmentContainer(CommitPage, {
  query: graphql`
    fragment CommitPage_query on Query {
      id
      repository(id: $repositoryId) {
        name
        title
        created
        object(oid: $oid) {
          ... on Commit {
            partialOid
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
  `,
});
