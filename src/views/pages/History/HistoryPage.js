import React from 'react';
import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import isEmpty from 'lodash/isEmpty';

// import CompactMemoryItem from 'global-components/CompactMemoryItem.js';
import CommitItem from 'global-components/CommitItem.js';
import MetaPortal from 'global-components/MetaPortal.js';

import CommitPager from './components/CommitPager.js';

class HistoryPage extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
  }
  render() {
    return (
      <div className="historypage">
        <h1 className="history-heading">
          Commits
        </h1>
        <div>
          {/* {this.props.query.repository.defaultBranchRef.target.history.edges.map(edge => (
            <CommitItem
              commit={edge.node}
            />
          ))} */}
          <CommitPager
            gitObject={this.props.query.repository.defaultBranchRef.target}
          />
        </div>
        {/* <HomeMemories query={this.props.query} /> */}
        <MetaPortal>
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

HistoryPage.propTypes = {
  query: PropTypes.object.isRequired,
};

export default createFragmentContainer(HistoryPage, {
  query: graphql`
    fragment HistoryPage_query on Query {
      id
      repository(id: $repositoryId) {
        name
        title
        created
        defaultBranchRef {
          target {
            ... on Commit {
              ...CommitPager_gitObject
            }
          }
        }
      }
      # ...HomeMemories_query
    }
  `,
});
