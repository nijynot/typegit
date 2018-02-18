import React from 'react';
import PropTypes from 'prop-types';
import {
  // createFragmentContainer,
  createRefetchContainer,
  createPaginationContainer,
  graphql,
} from 'react-relay';
import isEmpty from 'lodash/isEmpty';
// import { cursorToafter } from 'graphql-relay';

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
      before: this.props.query.memories.pageInfo.startCursor,
    });
    this.props.relay.refetch(refetchVariables, null, () => {
      window.scrollTo(0, 0);
    });
  }
  nextPage() {
    // Increments the number of stories being rendered by 20.
    const refetchVariables = () => ({
      first: 10,
      after: this.props.query.memories.pageInfo.endCursor,
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
        <div className="clearfix">
          {(this.props.query.memories.pageInfo.hasPreviousPage) ?
            <button
              className="homememories-load-btn left"
              onClick={this.previousPage}
            >
              Previous Page
            </button> : null}
          {(this.props.query.memories.pageInfo.hasNextPage) ?
            <button
              className="homememories-load-btn right"
              onClick={this.nextPage}
            >
              Next Page
            </button> : null}
        </div>
        {this.props.query.memories.edges.map((edge) => {
          return (
            // <CompactMemoryItem
            //   key={memory.id}
            //   memory={memory}
            // />
            <CozyMemoryItem
              key={edge.node.id}
              memory={edge.node}
            />
          );
        })}
        {(isEmpty(this.props.query.memories.edges)) ?
          <div className="homememories-empty-msg">
            No memories yet.&nbsp;
            <a href="/new">
              Create a new memory.
            </a>
          </div> : null}
        <div className="homememories-page-btn-container clearfix">
          {(this.props.query.memories.pageInfo.hasPreviousPage) ?
            <button
              className="homememories-load-btn left"
              onClick={this.previousPage}
            >
              Previous Page
            </button> : null}
          {(this.props.query.memories.pageInfo.hasNextPage) ?
            <button
              className="homememories-load-btn right"
              onClick={this.nextPage}
            >
              Next Page
            </button> : null}
        </div>
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
        memories(first: $first, after: $after, last: $last, before: $before) {
          edges {
            node {
              ...CompactMemoryItem_memory
              ...CozyMemoryItem_memory
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
