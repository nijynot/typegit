import React from 'react';
import PropTypes from 'prop-types';
import {
  // createFragmentContainer,
  createRefetchContainer,
  createPaginationContainer,
  graphql,
} from 'react-relay';
import isEmpty from 'lodash/isEmpty';
import { cursorToOffset, getOffsetWithDefault } from 'graphql-relay';

// import CompactMemoryItem from 'global-components/CompactMemoryItem.js';
import CozyMemoryItem from 'global-components/CozyMemoryItem.js';

class HomeMemories extends React.Component {
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
      before: this.props.query.repositories.pageInfo.startCursor,
    });
    this.props.relay.refetch(refetchVariables, null, () => {
      window.scrollTo(0, 0);
    });
  }
  nextPage() {
    // Increments the number of stories being rendered by 20.
    const refetchVariables = () => ({
      first: 10,
      after: this.props.query.repositories.pageInfo.endCursor,
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
          {(this.props.query.repositories.pageInfo.hasPreviousPage) ?
            <button
              className="homememories-load-btn left"
              onClick={this.previousPage}
            >
              Previous Page
            </button> : null}
          <span className="pagenumber">
            {Math.ceil(cursorToOffset(this.props.query.repositories.pageInfo.endCursor) / 10)}{' / '}
            {Math.ceil(this.props.query.repositories.totalCount / 10)}
          </span>
          {(this.props.query.repositories.pageInfo.hasNextPage) ?
            <button
              className="homememories-load-btn right"
              onClick={this.nextPage}
            >
              Next Page
            </button> : null}
        </div> */}
        {this.props.query.repositories.edges.map((edge) => {
          return (
            // <CompactMemoryItem
            //   key={memory.id}
            //   memory={memory}
            // />
            <CozyMemoryItem
              key={edge.node.id}
              repository={edge.node}
            />
          );
        })}
        {(isEmpty(this.props.query.repositories.edges)) ?
          <div className="homememories-empty-msg">
            No posts yet.&nbsp;
            <a href="/new">
              Create a new post.
            </a>
          </div> : null}
        {/* <div className="pagination clearfix">
          {(this.props.query.repositories.pageInfo.hasPreviousPage) ?
            <button
              className="homememories-load-btn left"
              onClick={this.previousPage}
            >
              Previous Page
            </button> : null}
          <span className="pagenumber">
            {Math.ceil((getOffsetWithDefault(this.props.query.repositories.pageInfo.endCursor, -1) + 1) / 10)}{' / '}
            {Math.ceil(this.props.query.repositories.totalCount / 10)}
          </span>
          {(this.props.query.repositories.pageInfo.hasNextPage) ?
            <button
              className="homememories-load-btn right"
              onClick={this.nextPage}
            >
              Next Page
            </button> : null}
        </div> */}
        <div className="homememories-page-btn-container clearfix">
          <button
            className="homememories-load-btn left"
            onClick={this.previousPage}
            disabled={!this.props.query.repositories.pageInfo.hasPreviousPage}
          >
            Previous Page
          </button>
          <span className="pagenumber">
            {Math.ceil((getOffsetWithDefault(this.props.query.repositories.pageInfo.endCursor, -1) + 1) / 10)}{' / '}
            {Math.ceil(this.props.query.repositories.totalCount / 10)}
          </span>
          <button
            className="homememories-load-btn right"
            onClick={this.nextPage}
            disabled={!this.props.query.repositories.pageInfo.hasNextPage}
          >
            Next Page
          </button>
        </div>
        {/* <div className="homememories-page-btn-container clearfix">
          {(this.props.query.repositories.pageInfo.hasPreviousPage) ?
            <button
              className="homememories-load-btn left"
              onClick={this.previousPage}
            >
              Previous Page
            </button> : null}
          {(this.props.query.repositories.pageInfo.hasNextPage) ?
            <button
              className="homememories-load-btn right"
              onClick={this.nextPage}
            >
              Next Page
            </button> : null}
        </div> */}
      </div>
    );
  }
}

HomeMemories.propTypes = {
  query: PropTypes.object.isRequired,
};

export default createRefetchContainer(
  HomeMemories,
  {
    query: graphql`
      fragment HomeMemories_query on Query @argumentDefinitions(
        first: { type: "Int!", defaultValue: 10 }
        after: { type: "String", defaultValue: "" }
        last: { type: "Int", defaultValue: 0 }
        before: { type: "String", defaultValue: "" }
      ) {
        repositories(first: $first, after: $after, last: $last, before: $before) {
          totalCount
          edges {
            node {
              id
              ...CozyMemoryItem_repository
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
      }
    `,
  },
  graphql`
    query HomeMemoriesRefetchQuery($first: Int!, $after: String, $last: Int, $before: String) {
      ...HomeMemories_query @arguments(first: $first, after: $after, last: $last, before: $before)
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
