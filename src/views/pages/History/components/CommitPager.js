import React from 'react';
import PropTypes from 'prop-types';
import {
  // createFragmentContainer,
  createRefetchContainer,
  createPaginationContainer,
  graphql,
} from 'react-relay';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import { cursorToOffset } from 'graphql-relay';

import CommitItem from 'global-components/CommitItem.js';

function historyCursorToOffset(cursor) {
  return parseInt(_.get(String(cursor).split(':'), '[1]'), 10);
}

function getHistoryOffsetWithDefault(cursor, defaultOffset) {
  if (typeof cursor !== 'string') {
    return defaultOffset;
  }
  const offset = historyCursorToOffset(cursor);
  return Number.isNaN(offset) ? defaultOffset : offset;
}

class CommitPager extends React.Component {
  constructor(props) {
    super(props);
    this.previousPage = this.previousPage.bind(this);
    this.nextPage = this.nextPage.bind(this);
  }
  previousPage() {
    // Increments the number of stories being rendered by 20.
    const refetchVariables = () => ({
      first: -1,
      after: '',
      last: 10,
      before: this.props.gitObject.history.pageInfo.startCursor,
    });
    this.props.relay.refetch(refetchVariables, null, () => {
      window.scrollTo(0, 0);
    });
  }
  nextPage() {
    // Increments the number of stories being rendered by 20.
    const params = document.location.pathname.split('/', 3);
    const repositoryId = params[1];
    const commitOid = params[2];
    const refetchVariables = () => ({
      repositoryId,
      first: 10,
      after: this.props.gitObject.history.pageInfo.endCursor,
      last: 0,
      before: '',
    });
    this.props.relay.refetch(refetchVariables, null, () => {
      window.scrollTo(0, 0);
    });
  }
  render() {
    return (
      <div className="homememories clearfix">
        {/* <div className="pagination clearfix">
          <button
            className="homememories-load-btn left"
            onClick={this.previousPage}
            disabled={!this.props.gitObject.history.pageInfo.hasPreviousPage}
          >
            Previous Page
          </button>
          <button
            className="homememories-load-btn right"
            onClick={this.nextPage}
            disabled={!this.props.gitObject.history.pageInfo.hasNextPage}
          >
            Next Page
          </button>
        </div> */}
        {(this.props.gitObject.history.edges.length) ?
          this.props.gitObject.history.edges.map(edge => (
            <CommitItem
              commit={edge.node}
            />
          )) : null
        }
        <div className="homememories-page-btn-container clearfix">
          <button
            className="homememories-load-btn left"
            onClick={this.previousPage}
            disabled={!this.props.gitObject.history.pageInfo.hasPreviousPage}
          >
            Previous Page
          </button>
          <button
            className="homememories-load-btn right"
            onClick={this.nextPage}
            disabled={!this.props.gitObject.history.pageInfo.hasNextPage}
          >
            Next Page
          </button>
        </div>
      </div>
    );
  }
}

CommitPager.propTypes = {
  gitObject: PropTypes.object.isRequired,
};

export default createRefetchContainer(
  CommitPager,
  {
    gitObject: graphql`
      fragment CommitPager_gitObject on Commit @argumentDefinitions(
        first: { type: "Int!", defaultValue: 10 }
        after: { type: "String", defaultValue: "" }
        last: { type: "Int", defaultValue: 0 }
        before: { type: "String", defaultValue: "" }
      ) {
        history(first: $first, after: $after, last: $last, before: $before) {
          edges {
            node {
              ...CommitItem_commit
            }
            cursor
          }
          pageInfo {
            hasPreviousPage
            hasNextPage
            startCursor
            endCursor
          }
        }
        # repositories(first: $first, after: $after, last: $last, before: $before) {
        #   edges {
        #     node {
        #       id
        #       ...CozyMemoryItem_repository
        #     }
        #     cursor
        #   }
        #   pageInfo {
        #     hasPreviousPage
        #     hasNextPage
        #     startCursor
        #     endCursor
        #   }
        # }
      }
    `,
  },
  graphql`
    query CommitPagerRefetchQuery(
      $repositoryId: String,
      $first: Int!,
      $after: String,
      $last: Int,
      $before: String,
    ) {
      repository(id: $repositoryId) {
        name
        title
        created
        defaultBranchRef {
          target {
            ... on Commit {
              ...CommitPager_gitObject @arguments(first: $first, after: $after, last: $last, before: $before)
            }
          }
        }
      }
    }
  `,
);

// memories(first: $first, after: $after, last: $last, before: $before) {
//   edges {
//     node {
//       ...CompactMemoryItem_memory
//       ...CozyMemoryItem_memory
//     }
//     cursor
//   }
//   pageInfo {
//     hasPreviousPage
//     hasNextPage
//     startCursor
//     endCursor
//   }
//   totalCount
// }
